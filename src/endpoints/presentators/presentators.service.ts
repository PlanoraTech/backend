import {
    Injectable,
    ConflictException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { PushNotificationsService } from '@app/push-notifications/push-notifications.service';
import { Presentators, Roles } from '@prisma/client';
import {
    PrismaClientKnownRequestError,
    PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import { CreatePresentatorDto } from './dto/create-presentator.dto';
import {
    UpdateSubstitutionDto,
    UpdateSubstitutionsDto,
} from './dto/update-substitution.dto';
import { UpdateMassDto } from '@app/dto/update-mass.dto';
import { AppointmentsDataService } from '@app/interfaces/DataService.interface';

const presentatorsSelect = {
    name: true,
};

@Injectable()
export class PresentatorsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly pushNotificationsService: PushNotificationsService,
    ) {}

    async create(
        institutionId: string,
        userId: string,
        createPresentatorDto: CreatePresentatorDto,
    ): Promise<void> {
        await this.prisma.$transaction(async (prisma) => {
            await prisma.presentators
                .create({
                    select: {
                        id: true,
                    },
                    data: {
                        name: createPresentatorDto.name,
                        institutions: {
                            connect: {
                                id: institutionId,
                            },
                        },
                    },
                })
                .catch((e) => {
                    if (e instanceof PrismaClientKnownRequestError) {
                        switch (e.code) {
                            case 'P2002':
                                return;
                        }
                    }
                    throw e;
                });
            if (userId) {
                await prisma.usersToInstitutions
                    .create({
                        select: {
                            institutionId: true,
                        },
                        data: {
                            role: Roles.PRESENTATOR,
                            user: {
                                connect: {
                                    id: userId,
                                },
                            },
                            institution: {
                                connect: {
                                    id: institutionId,
                                },
                            },
                            presentator: {
                                connect: {
                                    name: createPresentatorDto.name,
                                },
                            },
                        },
                    })
                    .catch((e) => {
                        if (e instanceof PrismaClientKnownRequestError) {
                            switch (e.code) {
                                case 'P2002':
                                    throw new ConflictException(
                                        'The given email is already assigned to a presentator',
                                    );
                                case 'P2025':
                                    throw new NotFoundException(
                                        'The given email is not assigned to an account',
                                    );
                            }
                        } else if (
                            e instanceof PrismaClientUnknownRequestError
                        ) {
                            throw new ConflictException(
                                'You are possibly trying to connect a user with a presentator that has already been connected',
                            );
                        }
                        throw e;
                    });
            }
        });
    }

    async findAll(institutionId: string): Promise<Presentators[]> {
        return await this.prisma.presentators.findMany({
            select: {
                id: true,
                ...presentatorsSelect,
            },
            where: {
                institutions: {
                    some: {
                        id: institutionId,
                    },
                },
            },
        });
    }

    async findOne(institutionId: string, id: string): Promise<Presentators> {
        return await this.prisma.presentators.findUniqueOrThrow({
            select: {
                id: true,
                ...presentatorsSelect,
            },
            where: {
                id: id,
                institutions: {
                    some: {
                        id: institutionId,
                    },
                },
            },
        });
    }

    async substitute(
        institutionId: string,
        id: string,
        substitutionDto: UpdateSubstitutionsDto,
    ): Promise<void> {
        await this.prisma.$transaction(
            async (prisma) => {
                const presentator: { id: string; name: string } =
                    await prisma.presentators.findUniqueOrThrow({
                        select: {
                            id: true,
                            name: true,
                        },
                        where: {
                            id: id,
                            institutions: {
                                some: {
                                    id: institutionId,
                                },
                            },
                        },
                    });

                const appointments: { id: string }[] =
                    await prisma.appointments.findMany({
                        select: {
                            id: true,
                        },
                        where: {
                            start: {
                                gte: new Date(substitutionDto.from),
                                lte: new Date(substitutionDto.to),
                            },
                            end: {
                                gte: new Date(substitutionDto.from),
                                lte: new Date(substitutionDto.to),
                            },
                            presentators: {
                                some: {
                                    presentator: {
                                        id: id,
                                        institutions: {
                                            some: {
                                                id: institutionId,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    });

                if (appointments.length === 0) {
                    throw new NotFoundException(
                        'No appointments were found for this period',
                    );
                }

                const substitutions: { id: string; from: Date; to: Date }[] =
                    await prisma.substitutions.findMany({
                        select: {
                            id: true,
                            from: true,
                            to: true,
                        },
                        where: {
                            presentatorId: id,
                        },
                        orderBy: {
                            from: 'asc',
                        },
                    });

                if (substitutionDto.isSubstituted) {
                    const adjacentSubstitutions: {
                        id: string;
                        from: Date;
                        to: Date;
                    }[] = substitutions.filter(
                        (sub) =>
                            sub.from.getTime() ===
                                new Date(substitutionDto.from).getTime() &&
                            sub.to.getTime() ===
                                new Date(substitutionDto.to).getTime(),
                    );
                    if (adjacentSubstitutions.length > 0) {
                        throw new ConflictException(
                            'Substitution has been already set for this period',
                        );
                    }
                    const overlappingSubstitutions: {
                        id: string;
                        from: Date;
                        to: Date;
                    }[] = substitutions.filter(
                        (sub) =>
                            sub.from <= new Date(substitutionDto.to) &&
                            sub.to >= new Date(substitutionDto.from),
                    );
                    await prisma.substitutions.deleteMany({
                        where: {
                            id: {
                                in: overlappingSubstitutions.map(
                                    (substitution) => {
                                        return substitution.id;
                                    },
                                ),
                            },
                        },
                    });
                    await prisma.substitutions.create({
                        select: {
                            id: true,
                        },
                        data: {
                            from: new Date(substitutionDto.from),
                            to: new Date(substitutionDto.to),
                            presentator: {
                                connect: {
                                    id: id,
                                },
                            },
                        },
                    });
                } else {
                    const overlappingSubstitutions: {
                        id: string;
                        from: Date;
                        to: Date;
                    }[] = substitutions.filter(
                        (sub) =>
                            sub.from <= new Date(substitutionDto.to) &&
                            sub.to >= new Date(substitutionDto.from),
                    );
                    for (const sub of overlappingSubstitutions) {
                        if (
                            substitutionDto.from > sub.from &&
                            substitutionDto.to < sub.to
                        ) {
                            await prisma.substitutions.delete({
                                select: {
                                    id: true,
                                },
                                where: {
                                    id: sub.id,
                                },
                            });

                            const updatedSubstitutions: {
                                from: Date;
                                to: Date;
                                presentatorId: string;
                            }[] = [
                                {
                                    from: sub.from,
                                    to: new Date(substitutionDto.from),
                                    presentatorId: id,
                                },
                                {
                                    from: new Date(substitutionDto.to),
                                    to: sub.to,
                                    presentatorId: id,
                                },
                            ];

                            await prisma.substitutions.createMany({
                                data: updatedSubstitutions,
                            });
                        } else if (
                            substitutionDto.from <= sub.from &&
                            substitutionDto.to < sub.to
                        ) {
                            await prisma.substitutions.update({
                                where: { id: sub.id },
                                data: { from: new Date(substitutionDto.to) },
                            });
                        } else if (
                            substitutionDto.from > sub.from &&
                            substitutionDto.to >= sub.to
                        ) {
                            await prisma.substitutions.update({
                                where: { id: sub.id },
                                data: { to: new Date(substitutionDto.from) },
                            });
                        } else if (
                            substitutionDto.from <= sub.from &&
                            substitutionDto.to >= sub.to
                        ) {
                            await prisma.substitutions.delete({
                                where: { id: sub.id },
                            });
                        }
                    }
                }

                await prisma.presentatorsToAppointments.updateMany({
                    data: {
                        isSubstituted: substitutionDto.isSubstituted,
                    },
                    where: {
                        appointmentId: {
                            in: appointments.map(
                                (appointment) => appointment.id,
                            ),
                        },
                        presentator: {
                            id: id,
                            institutions: {
                                some: {
                                    id: institutionId,
                                },
                            },
                        },
                    },
                });

                await this.pushNotificationsService.sendNotificationToPushServer(
                    await this.pushNotificationsService.getPushNotificationTokens(),
                    {
                        title: 'Substitution',
                        body: `Substitution has been ${substitutionDto.isSubstituted ? 'set' : 'cancelled'} by ${presentator.name} for the following date: ${new Date(substitutionDto.from).toLocaleDateString()} ${new Date(substitutionDto.from).toLocaleTimeString()} - ${new Date(substitutionDto.to).toLocaleTimeString()}`,
                    },
                );
            },
            {
                maxWait: 10000,
                timeout: 20000,
            },
        );
    }

    async remove(institutionId: string, id: string): Promise<void> {
        await this.prisma.$transaction(async (prisma) => {
            await prisma.usersToInstitutions.delete({
                select: {
                    institutionId: true,
                },
                where: {
                    presentatorId: id,
                    institution: {
                        id: institutionId,
                    },
                },
            });
            await prisma.presentators
                .delete({
                    select: {
                        id: true,
                    },
                    where: {
                        id: id,
                        institutions: {
                            none: {},
                        },
                    },
                })
                .catch((e) => {
                    if (e instanceof PrismaClientKnownRequestError) {
                        switch (e.code) {
                            case 'P2025':
                                return;
                        }
                    }
                    throw e;
                });
        });
    }
}

@Injectable()
export class PresentatorsFromAppointmentsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly pushNotificationsService: PushNotificationsService,
    ) {}

    async add(
        institutionId: string,
        dataService: AppointmentsDataService,
        presentatorId: string,
    ): Promise<void> {
        await this.prisma.$transaction(async (prisma) => {
            const presentator: { name: string } = await prisma.presentators
                .findUniqueOrThrow({
                    select: {
                        name: true,
                    },
                    where: {
                        id: presentatorId,
                        institutions: {
                            some: {
                                id: institutionId,
                            },
                        },
                    },
                })
                .catch((e) => {
                    if (e instanceof PrismaClientKnownRequestError) {
                        switch (e.code) {
                            case 'P2025':
                                throw new NotFoundException(
                                    'A presentator with the given id does not exists',
                                );
                        }
                    }
                    throw e;
                });
            const appointment: {
                start: Date;
                end: Date;
                subject: { name: string };
            } = await prisma.appointments
                .findUniqueOrThrow({
                    select: {
                        start: true,
                        end: true,
                        subject: {
                            select: {
                                name: true,
                            },
                        },
                    },
                    where: {
                        id: dataService.appointmentId,
                        timetables: {
                            some: {
                                id: dataService.timetableId,
                                institutionId: institutionId,
                            },
                        },
                        rooms: {
                            some: {
                                id: dataService.roomId,
                                institutionId: institutionId,
                            },
                        },
                        presentators: {
                            some: {
                                presentator: {
                                    id: dataService.presentatorId,
                                    institutions: {
                                        some: {
                                            id: institutionId,
                                        },
                                    },
                                },
                            },
                        },
                    },
                })
                .catch((e) => {
                    if (e instanceof PrismaClientKnownRequestError) {
                        switch (e.code) {
                            case 'P2025':
                                throw new NotFoundException(
                                    'Appointment not found',
                                );
                        }
                    }
                    throw e;
                });
            const appointments: { id: string }[] =
                await prisma.appointments.findMany({
                    select: {
                        id: true,
                    },
                    where: {
                        id: {
                            not: dataService.appointmentId,
                        },
                        timetables: {
                            some: {
                                institutionId: institutionId,
                            },
                        },
                        rooms: {
                            some: {
                                institutionId: institutionId,
                            },
                        },
                        presentators: {
                            some: {
                                presentator: {
                                    id: presentatorId,
                                    institutions: {
                                        some: {
                                            id: institutionId,
                                        },
                                    },
                                },
                            },
                        },
                        start: {
                            gte: appointment.start,
                            lte: appointment.end,
                        },
                        end: {
                            gte: appointment.start,
                            lte: appointment.end,
                        },
                    },
                });
            if (appointments.length > 0) {
                throw new ConflictException(
                    'This presentator is already assigned to an appointment during the time period this appointment is scheduled',
                );
            }
            await prisma.presentatorsToAppointments
                .create({
                    select: {
                        presentatorId: true,
                    },
                    data: {
                        appointmentId: dataService.appointmentId,
                        presentatorId: presentatorId,
                        isSubstituted: false,
                    },
                })
                .catch((e) => {
                    if (e instanceof PrismaClientKnownRequestError) {
                        switch (e.code) {
                            case 'P2002':
                                throw new ConflictException(
                                    'This presentator is already assigned to this appointment',
                                );
                        }
                    }
                    throw e;
                });
            await this.pushNotificationsService.sendNotificationToPushServer(
                await this.pushNotificationsService.getPushNotificationTokens(),
                {
                    title: 'Appointment update',
                    body: `${presentator.name} has been added to ${appointment.subject.name}: ${appointment.start.toLocaleDateString()} ${appointment.start.toLocaleTimeString()} - ${appointment.end.toLocaleTimeString()}`,
                },
            );
        });
    }

    async findAll(
        institutionId: string,
        dataService: AppointmentsDataService,
    ): Promise<Presentators[]> {
        return await this.prisma.presentators.findMany({
            select: {
                id: true,
                ...presentatorsSelect,
            },
            where: {
                appointments: {
                    some: {
                        appointmentId: dataService.appointmentId,
                        appointment: {
                            timetables: {
                                some: {
                                    id: dataService.timetableId,
                                    institutionId: institutionId,
                                },
                            },
                            rooms: {
                                some: {
                                    id: dataService.roomId,
                                    institutionId: institutionId,
                                },
                            },
                            presentators: {
                                some: {
                                    presentator: {
                                        id: dataService.presentatorId,
                                        institutions: {
                                            some: {
                                                id: institutionId,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    async findOne(
        institutionId: string,
        dataService: AppointmentsDataService,
        presentatorId: string,
    ): Promise<Presentators> {
        return await this.prisma.presentators.findUniqueOrThrow({
            select: {
                id: true,
                ...presentatorsSelect,
            },
            where: {
                id: presentatorId,
                appointments: {
                    some: {
                        appointmentId: dataService.appointmentId,
                        appointment: {
                            timetables: {
                                some: {
                                    id: dataService.timetableId,
                                    institutionId: institutionId,
                                },
                            },
                            rooms: {
                                some: {
                                    id: dataService.roomId,
                                    institutionId: institutionId,
                                },
                            },
                            presentators: {
                                some: {
                                    presentator: {
                                        id: dataService.presentatorId,
                                        institutions: {
                                            some: {
                                                id: institutionId,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    async findAvailablePresentators(
        institutionId: string,
        dataService: AppointmentsDataService,
    ): Promise<Presentators[]> {
        return await this.prisma.$transaction(async (prisma) => {
            const appointment: {
                start: Date;
                end: Date;
                presentators: { presentatorId: string }[];
            } = await prisma.appointments
                .findUniqueOrThrow({
                    select: {
                        start: true,
                        end: true,
                        presentators: {
                            select: {
                                presentatorId: true,
                            },
                        },
                    },
                    where: {
                        id: dataService.appointmentId,
                        timetables: {
                            some: {
                                id: dataService.timetableId,
                                institutionId: institutionId,
                            },
                        },
                        rooms: {
                            some: {
                                id: dataService.roomId,
                                institutionId: institutionId,
                            },
                        },
                        presentators: {
                            some: {
                                presentator: {
                                    id: dataService.presentatorId,
                                    institutions: {
                                        some: {
                                            id: institutionId,
                                        },
                                    },
                                },
                            },
                        },
                    },
                })
                .catch((e) => {
                    if (e instanceof PrismaClientKnownRequestError) {
                        switch (e.code) {
                            case 'P2025':
                                throw new NotFoundException(
                                    'Appointment not found',
                                );
                        }
                    }
                    throw e;
                });
            return await this.prisma.presentators.findMany({
                select: {
                    id: true,
                    ...presentatorsSelect,
                },
                where: {
                    id: {
                        notIn: appointment.presentators.map(
                            (presentator) => presentator.presentatorId,
                        ),
                    },
                    OR: [
                        {
                            appointments: {
                                none: {},
                            },
                        },
                        {
                            appointments: {
                                some: {
                                    appointment: {
                                        start: {
                                            gte: appointment.start,
                                            lte: appointment.end,
                                        },
                                        end: {
                                            gte: appointment.start,
                                            lte: appointment.end,
                                        },
                                        isCancelled: true,
                                    },
                                },
                            },
                        },
                        {
                            appointments: {
                                none: {
                                    appointment: {
                                        start: {
                                            gte: appointment.start,
                                            lte: appointment.end,
                                        },
                                        end: {
                                            gte: appointment.start,
                                            lte: appointment.end,
                                        },
                                        isCancelled: false,
                                    },
                                },
                            },
                        },
                    ],
                },
            });
        });
    }

    async substitute(
        institutionId: string,
        dataService: AppointmentsDataService,
        presentatorId: string,
        substitutionDto: UpdateSubstitutionDto,
    ): Promise<void> {
        const query: {
            presentator: {
                name: string;
            };
            appointment: {
                start: Date;
                end: Date;
                subject: {
                    name: string;
                };
            };
        } = await this.prisma.presentatorsToAppointments
            .update({
                select: {
                    appointment: {
                        select: {
                            start: true,
                            end: true,
                            subject: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                    presentator: {
                        select: {
                            name: true,
                        },
                    },
                },
                data: {
                    isSubstituted: substitutionDto.isSubstituted,
                },
                where: {
                    presentatorId_appointmentId: {
                        presentatorId: presentatorId,
                        appointmentId: dataService.appointmentId,
                    },
                    appointment: {
                        id: dataService.appointmentId,
                        timetables: {
                            some: {
                                id: dataService.timetableId,
                                institutionId: institutionId,
                            },
                        },
                        rooms: {
                            some: {
                                id: dataService.roomId,
                                institutionId: institutionId,
                            },
                        },
                        presentators: {
                            some: {
                                presentator: {
                                    id: dataService.presentatorId,
                                    institutions: {
                                        some: {
                                            id: institutionId,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            })
            .catch((e) => {
                if (e instanceof PrismaClientKnownRequestError) {
                    switch (e.code) {
                        case 'P2025':
                            throw new ForbiddenException(
                                'This presentator is not assigned to this appointment',
                            );
                    }
                }
                throw e;
            });
        await this.pushNotificationsService.sendNotificationToPushServer(
            await this.pushNotificationsService.getPushNotificationTokens(),
            {
                title: 'Substitution',
                body: `${query.presentator.name} is ${substitutionDto.isSubstituted ? 'substituted' : 'not substituted'} for the following appointment: ${query.appointment.subject.name}: ${query.appointment.start.toLocaleDateString()} ${query.appointment.start.toLocaleTimeString()} - ${query.appointment.end.toLocaleTimeString()}`,
            },
        );
    }

    async update(
        institutionId: string,
        dataService: AppointmentsDataService,
        updateMassDto: UpdateMassDto[],
    ): Promise<void> {
        await this.prisma.$transaction(async (prisma) => {
            const presentators: { id: string; name: string }[] =
                await prisma.presentators.findMany({
                    select: {
                        id: true,
                        name: true,
                    },
                    where: {
                        id: {
                            in: updateMassDto.map((presentator) => {
                                return presentator.id;
                            }),
                        },
                        institutions: {
                            some: {
                                id: institutionId,
                            },
                        },
                    },
                });
            if (
                !updateMassDto.every((presentator) => {
                    return presentators.find((p) => p.id === presentator.id);
                })
            ) {
                throw new NotFoundException(
                    'One or more presentator IDs were invalid',
                );
            }
            const appointment: {
                start: Date;
                end: Date;
                subject: { name: string };
            } = await prisma.appointments
                .findUniqueOrThrow({
                    select: {
                        start: true,
                        end: true,
                        subject: {
                            select: {
                                name: true,
                            },
                        },
                    },
                    where: {
                        id: dataService.appointmentId,
                        timetables: {
                            some: {
                                id: dataService.timetableId,
                                institutionId: institutionId,
                            },
                        },
                        rooms: {
                            some: {
                                id: dataService.roomId,
                                institutionId: institutionId,
                            },
                        },
                        presentators: {
                            some: {
                                presentator: {
                                    id: dataService.presentatorId,
                                    institutions: {
                                        some: {
                                            id: institutionId,
                                        },
                                    },
                                },
                            },
                        },
                    },
                })
                .catch((e) => {
                    if (e instanceof PrismaClientKnownRequestError) {
                        switch (e.code) {
                            case 'P2025':
                                throw new NotFoundException(
                                    'Appointment not found',
                                );
                        }
                    }
                    throw e;
                });
            const appointments: { id: string }[] =
                await prisma.appointments.findMany({
                    select: {
                        id: true,
                    },
                    where: {
                        id: {
                            not: dataService.appointmentId,
                        },
                        timetables: {
                            some: {
                                institutionId: institutionId,
                            },
                        },
                        rooms: {
                            some: {
                                institutionId: institutionId,
                            },
                        },
                        presentators: {
                            some: {
                                presentator: {
                                    id: {
                                        in: updateMassDto.map((presentator) => {
                                            return presentator.id;
                                        }),
                                    },
                                    institutions: {
                                        some: {
                                            id: institutionId,
                                        },
                                    },
                                },
                            },
                        },
                        start: {
                            gte: appointment.start,
                            lte: appointment.end,
                        },
                        end: {
                            gte: appointment.start,
                            lte: appointment.end,
                        },
                    },
                });
            if (appointments.length > 0) {
                throw new ConflictException(
                    'One or more of the presentators are already assigned to an appointment during the time period this appointment is scheduled',
                );
            }
            await prisma.presentatorsToAppointments.deleteMany({
                where: {
                    appointmentId: dataService.appointmentId,
                    presentatorId: {
                        not: dataService.presentatorId,
                    },
                },
            });
            await prisma.presentatorsToAppointments.createMany({
                data: updateMassDto.map((presentator) => ({
                    appointmentId: dataService.appointmentId,
                    presentatorId: presentator.id,
                    isSubstituted: false,
                })),
            });
            await this.pushNotificationsService.sendNotificationToPushServer(
                await this.pushNotificationsService.getPushNotificationTokens(),
                {
                    title: 'Appointment update',
                    body: `${presentators
                        .map((presentator) => {
                            return presentator.name;
                        })
                        .join(
                            ',',
                        )} has been added to ${appointment.subject.name}: ${appointment.start.toLocaleDateString()} ${appointment.start.toLocaleTimeString()} - ${appointment.end.toLocaleTimeString()}`,
                },
            );
        });
    }

    async remove(
        institutionId: string,
        dataService: AppointmentsDataService,
        presentatorId: string,
    ): Promise<void> {
        const query: {
            presentator: { name: string };
            appointment: { start: Date; end: Date; subject: { name: string } };
        } = await this.prisma.presentatorsToAppointments.delete({
            select: {
                presentator: {
                    select: {
                        name: true,
                    },
                },
                appointment: {
                    select: {
                        start: true,
                        end: true,
                        subject: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            where: {
                presentatorId_appointmentId: {
                    presentatorId: presentatorId,
                    appointmentId: dataService.appointmentId,
                },
                presentator: {
                    id: presentatorId,
                    institutions: {
                        some: {
                            id: institutionId,
                        },
                    },
                },
                appointment: {
                    id: dataService.appointmentId,
                    timetables: {
                        some: {
                            id: dataService.timetableId,
                            institutionId: institutionId,
                        },
                    },
                    rooms: {
                        some: {
                            id: dataService.roomId,
                            institutionId: institutionId,
                        },
                    },
                },
            },
        });
        await this.pushNotificationsService.sendNotificationToPushServer(
            await this.pushNotificationsService.getPushNotificationTokens(),
            {
                title: 'Appointment update',
                body: `${query.presentator.name} has been removed from ${query.appointment.subject.name}: ${query.appointment.start.toLocaleDateString()} ${query.appointment.start.toLocaleTimeString()} - ${query.appointment.end.toLocaleTimeString()}`,
            },
        );
    }
}

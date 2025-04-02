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
        const presentator: { id: string; name: string } =
            await this.prisma.presentators.findUniqueOrThrow({
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
            await this.prisma.appointments.findMany({
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

        const existingSubstitutions = await this.prisma.substitutions.findMany({
            where: {
                presentatorId: id,
            },
            orderBy: {
                from: 'asc',
            },
        });

        await this.prisma.$transaction(async (prisma) => {
            if (substitutionDto.isSubstituted) {
                const overlappingOrAdjacentSubs = existingSubstitutions.filter(
                    (sub) => {
                        const isAdjacent =
                            sub.to.getTime() ===
                                substitutionDto.from.getTime() ||
                            sub.from.getTime() === substitutionDto.to.getTime();

                        const isOverlapping =
                            sub.from <= substitutionDto.to &&
                            sub.to >= substitutionDto.from;

                        return isAdjacent || isOverlapping;
                    },
                );

                if (overlappingOrAdjacentSubs.length > 0) {
                    const allDates = [
                        ...overlappingOrAdjacentSubs
                            .map((sub) => [sub.from, sub.to])
                            .flat(),
                        substitutionDto.from,
                        substitutionDto.to,
                    ];

                    const mergedFrom = new Date(
                        Math.min(...allDates.map((d) => d.getTime())),
                    );
                    const mergedTo = new Date(
                        Math.max(...allDates.map((d) => d.getTime())),
                    );

                    await prisma.substitutions.deleteMany({
                        where: {
                            id: {
                                in: overlappingOrAdjacentSubs.map(
                                    (sub) => sub.id,
                                ),
                            },
                        },
                    });

                    await prisma.substitutions.create({
                        data: {
                            from: mergedFrom,
                            to: mergedTo,
                            presentator: {
                                connect: {
                                    id: id,
                                },
                            },
                        },
                    });
                } else {
                    await prisma.substitutions.create({
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
                }
            } else {
                const overlappingSubs = existingSubstitutions.filter(
                    (sub) =>
                        sub.from <= substitutionDto.to &&
                        sub.to >= substitutionDto.from,
                );

                for (const sub of overlappingSubs) {
                    if (
                        substitutionDto.from > sub.from &&
                        substitutionDto.to < sub.to
                    ) {
                        await prisma.substitutions.delete({
                            where: { id: sub.id },
                        });

                        await prisma.substitutions.create({
                            data: {
                                from: sub.from,
                                to: new Date(substitutionDto.from),
                                presentator: { connect: { id } },
                            },
                        });

                        await prisma.substitutions.create({
                            data: {
                                from: new Date(substitutionDto.to),
                                to: sub.to,
                                presentator: { connect: { id } },
                            },
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
                        in: appointments.map((appointment) => appointment.id),
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
        });

        await this.pushNotificationsService.sendNotificationToPushServer(
            await this.pushNotificationsService.getPushNotificationTokens(),
            {
                title: substitutionDto.isSubstituted
                    ? 'Absence Added'
                    : 'Presence Added',
                body: `${presentator.name} has been ${substitutionDto.isSubstituted ? 'marked absent' : 'marked present'} between ${substitutionDto.from.toLocaleString()} and ${substitutionDto.to.toLocaleString()}`,
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

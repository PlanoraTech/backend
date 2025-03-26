import {
    Injectable,
    ConflictException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { PushNotificationsService } from '@app/push-notifications/push-notifications.service';
import { Presentators, Roles } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreatePresentatorDto } from './dto/create-presentator.dto';
import { AppointmentsDataService } from '@app/interfaces/DataService.interface';
import {
    UpdateSubstitutionDto,
    UpdateSubstitutionsDto,
} from './dto/update-substitution.dto';

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
            if (createPresentatorDto.email) {
                await prisma.usersToInstitutions
                    .create({
                        select: {
                            institutionId: true,
                        },
                        data: {
                            role: Roles.PRESENTATOR,
                            user: {
                                connect: {
                                    email: createPresentatorDto.email,
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
        await this.prisma.$transaction(async (prisma) => {
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
            await prisma.appointments.updateMany({
                data: {
                    isCancelled: true,
                },
                where: {
                    id: {
                        in: appointments.map((appointment) => appointment.id),
                    },
                    presentators: {
                        every: {
                            presentator: {
                                institutions: {
                                    some: {
                                        id: institutionId,
                                    },
                                },
                            },
                            isSubstituted: true,
                        },
                    },
                },
            });
        });
        const presentator: { name: string } =
            await this.prisma.presentators.findUniqueOrThrow({
                select: {
                    name: true,
                },
                where: {
                    id: id,
                },
            });
        await this.pushNotificationsService.sendNotificationToPushServer(
            await this.pushNotificationsService.getPushNotificationTokens(),
            {
                title: 'Substitution',
                body: `${presentator.name} has been substituted between ${substitutionDto.from} and ${substitutionDto.to}`,
            },
        );
    }

    async remove(institutionId: string, id: string): Promise<void> {
        await this.prisma.usersToInstitutions.delete({
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
        await this.prisma.presentators
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
        await this.prisma.appointments.update({
            select: {
                id: true,
            },
            data: {
                presentators: {
                    connect: {
                        presentatorId_appointmentId: {
                            presentatorId: presentatorId,
                            appointmentId: dataService.appointmentId,
                        },
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
        await this.prisma.$transaction(async (prisma) => {
            const appointment: {
                appointment: {
                    start: Date;
                    end: Date;
                    subject: { name: string };
                };
            } = await prisma.presentatorsToAppointments
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
                                    'The presentator is not assigned to the appointment',
                                );
                        }
                    }
                    throw e;
                });
            await prisma.appointments
                .update({
                    select: {
                        id: true,
                    },
                    data: {
                        isCancelled: true,
                    },
                    where: {
                        id: dataService.appointmentId,
                        presentators: {
                            every: {
                                presentator: {
                                    institutions: {
                                        some: {
                                            id: institutionId,
                                        },
                                    },
                                },
                                isSubstituted: true,
                            },
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
            const presentator: { name: string } =
                await this.prisma.presentators.findUniqueOrThrow({
                    select: {
                        name: true,
                    },
                    where: {
                        id: presentatorId,
                    },
                });
            await this.pushNotificationsService.sendNotificationToPushServer(
                await this.pushNotificationsService.getPushNotificationTokens(),
                {
                    title: 'Substitution',
                    body: substitutionDto.isSubstituted
                        ? `${presentator.name} has been substituted for the following appointment: ${appointment.appointment.subject.name} ${appointment.appointment.start.toLocaleDateString()} ${appointment.appointment.start.toLocaleTimeString()} - ${appointment.appointment.end.toLocaleTimeString()}`
                        : `Substitution for ${presentator.name} has been cancelled for the following appointment: ${appointment.appointment.subject.name} ${appointment.appointment.start.toLocaleDateString()} ${appointment.appointment.start.toLocaleTimeString()} - ${appointment.appointment.end.toLocaleTimeString()}`,
                },
            );
        });
    }

    async remove(
        institutionId: string,
        dataService: AppointmentsDataService,
        presentatorId: string,
    ): Promise<void> {
        await this.prisma.appointments.update({
            select: {
                id: true,
            },
            data: {
                presentators: {
                    disconnect: {
                        presentatorId_appointmentId: {
                            presentatorId: presentatorId,
                            appointmentId: dataService.appointmentId,
                        },
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
        });
    }
}

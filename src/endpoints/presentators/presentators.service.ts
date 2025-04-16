import {
    Injectable,
    ConflictException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { PushNotificationsService } from '@app/push-notifications/push-notifications.service';
import { Prisma, Roles } from '@prisma/client';
import {
    PrismaClientKnownRequestError,
    PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import {
    appointmentSelect,
    appointmentsSelect,
    getAppointment,
} from '@app/utils/generic.util';
import {
    getOverlappingAppointments,
    getOverlappingSubstitutions,
    getPresentator,
    getPresentators,
    presentatorsSelect,
} from './utils/presentators.util';
import { CreatePresentatorDto } from './dto/create-presentator.dto';
import {
    UpdateSubstitutionDto,
    UpdateSubstitutionsDto,
} from './dto/update-substitution.dto';
import { UpdateMassDto } from '@app/dto/update-mass.dto';
import { AppointmentsDataService } from '@app/interfaces/dataservice.interface';

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

    async findAll(institutionId: string): Promise<
        Prisma.PresentatorsGetPayload<{
            select: typeof presentatorsSelect;
        }>[]
    > {
        return await getPresentators(this.prisma, institutionId);
    }

    async findOne(
        institutionId: string,
        id: string,
    ): Promise<
        Prisma.PresentatorsGetPayload<{
            select: typeof presentatorsSelect;
        }>
    > {
        return await getPresentator(this.prisma, institutionId, id);
    }

    async substitute(
        institutionId: string,
        id: string,
        substitutionDto: UpdateSubstitutionsDto,
    ): Promise<void> {
        await this.prisma.$transaction(
            async (prisma) => {
                const presentator: Prisma.PresentatorsGetPayload<{
                    select: typeof presentatorsSelect;
                }> = await getPresentator(prisma, institutionId, id);
                const appointments: Prisma.AppointmentsGetPayload<{
                    select: typeof appointmentsSelect;
                }>[] = await getOverlappingAppointments(
                    prisma,
                    institutionId,
                    [],
                    [id],
                    new Date(substitutionDto.from),
                    new Date(substitutionDto.to),
                );

                if (appointments.length === 0) {
                    throw new NotFoundException(
                        'No appointments were found for this period',
                    );
                }

                const substitutions: Prisma.SubstitutionsGetPayload<{
                    select: {
                        id: true;
                        from: true;
                        to: true;
                    };
                }>[] = await prisma.substitutions.findMany({
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

                const adjacentSubstitutions: Prisma.SubstitutionsGetPayload<{
                    select: {
                        id: true;
                        from: true;
                        to: true;
                    };
                }>[] = substitutions.filter(
                    (sub) =>
                        sub.from.getTime() ===
                            new Date(substitutionDto.from).getTime() &&
                        sub.to.getTime() ===
                            new Date(substitutionDto.to).getTime(),
                );
                if (substitutionDto.isSubstituted) {
                    if (adjacentSubstitutions.length > 0) {
                        throw new ConflictException(
                            'Substitution has been already set for this period',
                        );
                    }
                    const overlappingSubstitutions: Prisma.SubstitutionsGetPayload<{
                        select: {
                            id: true;
                            from: true;
                            to: true;
                        };
                    }>[] = getOverlappingSubstitutions(
                        substitutions,
                        new Date(substitutionDto.to),
                        new Date(substitutionDto.from),
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
                    if (adjacentSubstitutions.length > 0) {
                        await prisma.substitutions.deleteMany({
                            where: {
                                id: {
                                    in: adjacentSubstitutions.map(
                                        (substitution) => {
                                            return substitution.id;
                                        },
                                    ),
                                },
                            },
                        });
                    }
                    const overlappingSubstitutions: Prisma.SubstitutionsGetPayload<{
                        select: {
                            id: true;
                            from: true;
                            to: true;
                        };
                    }>[] = getOverlappingSubstitutions(
                        substitutions,
                        new Date(substitutionDto.to),
                        new Date(substitutionDto.from),
                    );
                    for (const substitution of overlappingSubstitutions) {
                        await prisma.substitutions
                            .delete({
                                select: {
                                    id: true,
                                },
                                where: {
                                    id: substitution.id,
                                },
                            })
                            .catch((e) => {
                                if (
                                    e instanceof PrismaClientKnownRequestError
                                ) {
                                    switch (e.code) {
                                        case 'P2025':
                                            return;
                                    }
                                }
                                throw e;
                            });
                        if (
                            substitution.from.getTime() ===
                                new Date(substitutionDto.from).getTime() &&
                            substitution.to.getTime() >
                                new Date(substitutionDto.to).getTime()
                        ) {
                            await prisma.substitutions.create({
                                data: {
                                    from: new Date(substitutionDto.to),
                                    to: substitution.to,
                                    presentatorId: id,
                                },
                            });
                        } else if (
                            substitution.from.getTime() <
                                new Date(substitutionDto.from).getTime() &&
                            substitution.to.getTime() ===
                                new Date(substitutionDto.to).getTime()
                        ) {
                            await prisma.substitutions.create({
                                data: {
                                    from: new Date(substitutionDto.to),
                                    to: substitution.to,
                                    presentatorId: id,
                                },
                            });
                        } else if (
                            substitution.from.getTime() <
                                new Date(substitutionDto.from).getTime() &&
                            substitution.to.getTime() >
                                new Date(substitutionDto.to).getTime()
                        ) {
                            await prisma.substitutions.createMany({
                                data: [
                                    {
                                        from: substitution.from,
                                        to: new Date(substitutionDto.from),
                                        presentatorId: id,
                                    },
                                    {
                                        from: new Date(substitutionDto.to),
                                        to: substitution.to,
                                        presentatorId: id,
                                    },
                                ],
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
            const presentator: Prisma.PresentatorsGetPayload<{
                select: typeof presentatorsSelect;
            }> = await getPresentator(prisma, institutionId, presentatorId);
            const appointment: Prisma.AppointmentsGetPayload<{
                select: typeof appointmentSelect;
            }> = await getAppointment(prisma, institutionId, dataService);
            const appointments: Prisma.AppointmentsGetPayload<{
                select: typeof appointmentsSelect;
            }>[] = await getOverlappingAppointments(
                prisma,
                institutionId,
                [dataService.appointmentId],
                [presentatorId],
                appointment.start,
                appointment.end,
            );
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
    ): Promise<
        Prisma.PresentatorsGetPayload<{
            select: typeof presentatorsSelect;
        }>[]
    > {
        return await this.prisma.presentators.findMany({
            select: {
                ...presentatorsSelect,
            },
            where: {
                appointments: {
                    some: {
                        appointmentId: dataService.appointmentId,
                        appointment: {
                            timetables: dataService.timetableId
                                ? {
                                      some: {
                                          id: dataService.timetableId,
                                          institutionId: institutionId,
                                      },
                                  }
                                : undefined,
                            rooms: dataService.roomId
                                ? {
                                      some: {
                                          id: dataService.roomId,
                                          institutionId: institutionId,
                                      },
                                  }
                                : undefined,
                            presentators: dataService.presentatorId
                                ? {
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
                                  }
                                : undefined,
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
    ): Promise<
        Prisma.PresentatorsGetPayload<{
            select: typeof presentatorsSelect;
        }>
    > {
        return await this.prisma.presentators.findUniqueOrThrow({
            select: {
                ...presentatorsSelect,
            },
            where: {
                id: presentatorId,
                appointments: {
                    some: {
                        appointmentId: dataService.appointmentId,
                        appointment: {
                            timetables: dataService.timetableId
                                ? {
                                      some: {
                                          id: dataService.timetableId,
                                          institutionId: institutionId,
                                      },
                                  }
                                : undefined,
                            rooms: dataService.roomId
                                ? {
                                      some: {
                                          id: dataService.roomId,
                                          institutionId: institutionId,
                                      },
                                  }
                                : undefined,
                            presentators: dataService.presentatorId
                                ? {
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
                                  }
                                : undefined,
                        },
                    },
                },
            },
        });
    }

    async findAvailablePresentators(
        institutionId: string,
        dataService: AppointmentsDataService,
    ): Promise<
        Prisma.PresentatorsGetPayload<{
            select: typeof presentatorsSelect;
        }>[]
    > {
        return await this.prisma.$transaction(async (prisma) => {
            const appointment: Prisma.AppointmentsGetPayload<{
                select: {
                    start: true;
                    end: true;
                    presentators: {
                        select: {
                            presentatorId: true;
                        };
                    };
                };
            }> = await getAppointment(prisma, institutionId, dataService, {
                start: true,
                end: true,
                presentators: {
                    select: {
                        presentatorId: true,
                    },
                },
            });
            return await this.prisma.presentators.findMany({
                select: {
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
        const query: Prisma.PresentatorsToAppointmentsGetPayload<{
            select: {
                presentator: {
                    select: {
                        name: true;
                    };
                };
                appointment: {
                    select: {
                        start: true;
                        end: true;
                        subject: {
                            select: {
                                name: true;
                            };
                        };
                    };
                };
            };
        }> = await this.prisma.presentatorsToAppointments
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
                        timetables: dataService.timetableId
                            ? {
                                  some: {
                                      id: dataService.timetableId,
                                      institutionId: institutionId,
                                  },
                              }
                            : undefined,
                        rooms: dataService.roomId
                            ? {
                                  some: {
                                      id: dataService.roomId,
                                      institutionId: institutionId,
                                  },
                              }
                            : undefined,
                        presentators: dataService.presentatorId
                            ? {
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
                              }
                            : undefined,
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
            const presentators: Prisma.PresentatorsGetPayload<{
                select: typeof presentatorsSelect;
            }>[] = await getPresentators(
                prisma,
                institutionId,
                updateMassDto.map((presentator) => {
                    return presentator.id;
                }),
            );
            if (
                !updateMassDto.every((presentator) => {
                    return presentators.find((p) => p.id === presentator.id);
                })
            ) {
                throw new NotFoundException(
                    'One or more presentator IDs were invalid',
                );
            }
            const appointment: Prisma.AppointmentsGetPayload<{
                select: typeof appointmentSelect;
            }> = await getAppointment(prisma, institutionId, dataService);
            const appointments: { id: string }[] =
                await getOverlappingAppointments(
                    prisma,
                    institutionId,
                    [dataService.appointmentId],
                    updateMassDto.map((presentator) => {
                        return presentator.id;
                    }),
                    appointment.start,
                    appointment.end,
                );
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
        const query: Prisma.PresentatorsToAppointmentsGetPayload<{
            select: {
                presentator: {
                    select: {
                        name: true;
                    };
                };
                appointment: {
                    select: {
                        start: true;
                        end: true;
                        subject: {
                            select: {
                                name: true;
                            };
                        };
                    };
                };
            };
        }> = await this.prisma.presentatorsToAppointments.delete({
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
                    timetables: dataService.timetableId
                        ? {
                              some: {
                                  id: dataService.timetableId,
                                  institutionId: institutionId,
                              },
                          }
                        : undefined,
                    rooms: dataService.roomId
                        ? {
                              some: {
                                  id: dataService.roomId,
                                  institutionId: institutionId,
                              },
                          }
                        : undefined,
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

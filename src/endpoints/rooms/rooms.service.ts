import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { getAppointment } from '@app/utils/generic.util';
import {
    getOverlappingAppointments,
    getRoom,
    getRooms,
    roomsSelect,
} from './utils/rooms.util';
import { PushNotificationsService } from '@app/push-notifications/push-notifications.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UpdateMassDto } from '@app/dto/update-mass.dto';
import { AppointmentsDataService } from '@app/interfaces/dataservice.interface';

@Injectable()
export class RoomsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        institutionId: string,
        createRoomDto: CreateRoomDto,
    ): Promise<void> {
        await this.prisma.rooms.create({
            select: {
                id: true,
            },
            data: {
                ...createRoomDto,
                institutionId: institutionId,
            },
        });
    }

    async findAll(institutionId: string): Promise<
        Prisma.RoomsGetPayload<{
            select: typeof roomsSelect;
        }>[]
    > {
        return await getRooms(this.prisma, institutionId);
    }

    async findOne(
        institutionId: string,
        id: string,
    ): Promise<
        Prisma.RoomsGetPayload<{
            select: typeof roomsSelect;
        }>
    > {
        return await getRoom(this.prisma, institutionId, id);
    }

    async update(
        institutionId: string,
        id: string,
        updateRoomDto: UpdateRoomDto,
    ): Promise<void> {
        await this.prisma.rooms.update({
            select: {
                id: true,
            },
            data: {
                ...updateRoomDto,
            },
            where: {
                id: id,
                institutionId: institutionId,
            },
        });
    }

    async remove(institutionId: string, id: string): Promise<void> {
        await this.prisma.rooms.delete({
            select: {
                id: true,
            },
            where: {
                id: id,
                institutionId: institutionId,
            },
        });
    }
}

@Injectable()
export class RoomsFromAppointmentsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly pushNotificationsService: PushNotificationsService,
    ) {}

    async add(
        institutionId: string,
        dataService: AppointmentsDataService,
        roomId: string,
    ): Promise<void> {
        await this.prisma.$transaction(async (prisma) => {
            const room: { name: string } = await getRoom(
                prisma,
                institutionId,
                roomId,
            );
            const appointment: {
                start: Date;
                end: Date;
                subject: { name: string };
            } = await getAppointment(prisma, institutionId, dataService);
            const appointments: { id: string }[] =
                await getOverlappingAppointments(
                    prisma,
                    institutionId,
                    [dataService.appointmentId],
                    [roomId],
                    appointment.start,
                    appointment.end,
                );
            if (appointments.length > 0) {
                throw new ConflictException(
                    'This room is already assigned to an appointment when this appointment is scheduled',
                );
            }
            await prisma.appointments
                .update({
                    select: {
                        id: true,
                    },
                    data: {
                        rooms: {
                            connect: {
                                id: roomId,
                                institutionId: institutionId,
                            },
                        },
                    },
                    where: {
                        id: dataService.appointmentId,
                        timetables: dataService.timetableId
                            ? {
                                  some: {
                                      id: dataService.timetableId,
                                      institutionId: institutionId,
                                  },
                              }
                            : Prisma.skip,
                        rooms: dataService.roomId
                            ? {
                                  some: {
                                      id: dataService.roomId,
                                      institutionId: institutionId,
                                  },
                              }
                            : Prisma.skip,
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
                            : Prisma.skip,
                    },
                })
                .catch((e) => {
                    if (e instanceof PrismaClientKnownRequestError) {
                        switch (e.code) {
                            case 'P2002':
                                throw new ConflictException(
                                    'This room is already assigned to this appointment',
                                );
                        }
                    }
                    throw e;
                });
            await this.pushNotificationsService.sendNotificationToPushServer(
                await this.pushNotificationsService.getPushNotificationTokens(),
                {
                    title: 'Appointment update',
                    body: `${room.name} has been added to ${appointment.subject.name}: ${appointment.start.toLocaleDateString()} ${appointment.start.toLocaleTimeString()} - ${appointment.end.toLocaleTimeString()}`,
                },
            );
        });
    }

    async findAll(
        institutionId: string,
        dataService: AppointmentsDataService,
    ): Promise<
        Prisma.RoomsGetPayload<{
            select: typeof roomsSelect;
        }>[]
    > {
        return await this.prisma.rooms.findMany({
            select: {
                id: true,
                ...roomsSelect,
            },
            where: {
                appointments: {
                    some: {
                        id: dataService.appointmentId,
                        timetables: dataService.timetableId
                            ? {
                                  some: {
                                      id: dataService.timetableId,
                                      institutionId: institutionId,
                                  },
                              }
                            : Prisma.skip,
                        rooms: dataService.roomId
                            ? {
                                  some: {
                                      id: dataService.roomId,
                                      institutionId: institutionId,
                                  },
                              }
                            : Prisma.skip,
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
                            : Prisma.skip,
                    },
                },
            },
        });
    }

    async findOne(
        institutionId: string,
        dataService: AppointmentsDataService,
        roomId: string,
    ): Promise<
        Prisma.RoomsGetPayload<{
            select: typeof roomsSelect;
        }>
    > {
        return await this.prisma.rooms.findUniqueOrThrow({
            select: {
                id: true,
                ...roomsSelect,
            },
            where: {
                id: roomId,
                appointments: {
                    some: {
                        id: dataService.appointmentId,
                        timetables: dataService.timetableId
                            ? {
                                  some: {
                                      id: dataService.timetableId,
                                      institutionId: institutionId,
                                  },
                              }
                            : Prisma.skip,
                        rooms: dataService.roomId
                            ? {
                                  some: {
                                      id: dataService.roomId,
                                      institutionId: institutionId,
                                  },
                              }
                            : Prisma.skip,
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
                            : Prisma.skip,
                    },
                },
            },
        });
    }

    async findAvailableRooms(
        institutionId: string,
        dataService: AppointmentsDataService,
    ): Promise<
        Prisma.RoomsGetPayload<{
            select: typeof roomsSelect;
        }>[]
    > {
        return await this.prisma.$transaction(async (prisma) => {
            const appointment: {
                start: Date;
                end: Date;
                rooms: { id: string }[];
            } = await prisma.appointments
                .findUniqueOrThrow({
                    select: {
                        start: true,
                        end: true,
                        rooms: {
                            select: {
                                id: true,
                            },
                        },
                    },
                    where: {
                        id: dataService.appointmentId,
                        timetables: dataService.timetableId
                            ? {
                                  some: {
                                      id: dataService.timetableId,
                                      institutionId: institutionId,
                                  },
                              }
                            : Prisma.skip,
                        rooms: dataService.roomId
                            ? {
                                  some: {
                                      id: dataService.roomId,
                                      institutionId: institutionId,
                                  },
                              }
                            : Prisma.skip,
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
                            : Prisma.skip,
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
            return await prisma.rooms.findMany({
                select: {
                    id: true,
                    ...roomsSelect,
                },
                where: {
                    id: {
                        notIn: appointment.rooms.map((room) => room.id),
                    },
                    institutionId: institutionId,
                    OR: [
                        {
                            appointments: {
                                none: {},
                            },
                        },
                        {
                            appointments: {
                                some: {
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
                        {
                            appointments: {
                                none: {
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
                    ],
                },
            });
        });
    }

    async update(
        institutionId: string,
        dataService: AppointmentsDataService,
        updateMassDto: UpdateMassDto[],
    ): Promise<void> {
        await this.prisma.$transaction(async (prisma) => {
            const rooms: { id: string; name: string }[] =
                await prisma.rooms.findMany({
                    select: {
                        id: true,
                        name: true,
                    },
                    where: {
                        id: {
                            in: updateMassDto.map((room) => {
                                return room.id;
                            }),
                        },
                        institutionId: institutionId,
                    },
                });
            if (
                !updateMassDto.every((room) => {
                    return rooms.find((r) => r.id === room.id);
                })
            ) {
                throw new NotFoundException(
                    'One or more room IDs were invalid',
                );
            }
            const appointment: {
                start: Date;
                end: Date;
                subject: { name: string };
            } = await getAppointment(prisma, institutionId, dataService);
            const appointments: { id: string }[] =
                await getOverlappingAppointments(
                    prisma,
                    institutionId,
                    [dataService.appointmentId],
                    updateMassDto.map((room) => room.id),
                    appointment.start,
                    appointment.end,
                );
            if (appointments.length > 0) {
                throw new ConflictException(
                    'One or more of the presentators are already assigned to an appointment during the time period this appointment is scheduled',
                );
            }
            await prisma.appointments.update({
                select: {
                    id: true,
                },
                data: {
                    rooms: {
                        set: [],
                        connect: updateMassDto.map((room) => {
                            return {
                                id: room.id,
                                institutionId: institutionId,
                            };
                        }),
                    },
                },
                where: {
                    id: dataService.appointmentId,
                    timetables: dataService.timetableId
                        ? {
                              some: {
                                  id: dataService.timetableId,
                                  institutionId: institutionId,
                              },
                          }
                        : Prisma.skip,
                    rooms: dataService.roomId
                        ? {
                              some: {
                                  id: dataService.roomId,
                                  institutionId: institutionId,
                              },
                          }
                        : Prisma.skip,
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
                        : Prisma.skip,
                },
            });
            await this.pushNotificationsService.sendNotificationToPushServer(
                await this.pushNotificationsService.getPushNotificationTokens(),
                {
                    title: 'Appointment update',
                    body: `${rooms
                        .map((room) => {
                            return room.name;
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
        roomId: string,
    ): Promise<void> {
        await this.prisma.$transaction(async (prisma) => {
            const room: { name: string } = await getRoom(
                prisma,
                institutionId,
                roomId,
            );
            const appointment: {
                start: Date;
                end: Date;
                subject: {
                    name: string;
                };
            } = await prisma.appointments.update({
                select: {
                    start: true,
                    end: true,
                    subject: {
                        select: {
                            name: true,
                        },
                    },
                },
                data: {
                    rooms: {
                        disconnect: {
                            id: roomId,
                            institutionId: institutionId,
                        },
                    },
                },
                where: {
                    id: dataService.appointmentId,
                    timetables: dataService.timetableId
                        ? {
                              some: {
                                  id: dataService.timetableId,
                                  institutionId: institutionId,
                              },
                          }
                        : Prisma.skip,
                    rooms: dataService.roomId
                        ? {
                              some: {
                                  id: dataService.roomId,
                                  institutionId: institutionId,
                              },
                          }
                        : Prisma.skip,
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
                        : Prisma.skip,
                },
            });
            await this.pushNotificationsService.sendNotificationToPushServer(
                await this.pushNotificationsService.getPushNotificationTokens(),
                {
                    title: 'Appointment update',
                    body: `${room.name} has been removed from ${appointment.subject.name}: ${appointment.start.toLocaleDateString()} ${appointment.start.toLocaleTimeString()} - ${appointment.end.toLocaleTimeString()}`,
                },
            );
        });
    }
}

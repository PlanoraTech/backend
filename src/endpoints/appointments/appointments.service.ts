import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { DataService } from '@app/interfaces/dataservice.interface';
import { ExtendedAppointments } from './interfaces/extendedappointments.interface';

export const appointmentsSelect = {
    id: true,
    subjectId: false,
    subject: {
        select: {
            id: true,
            name: true,
            subjectId: true,
        },
    },
    presentators: {
        select: {
            presentator: {
                select: {
                    id: true,
                    name: true,
                },
            },
            isSubstituted: true,
        },
    },
    rooms: {
        select: {
            id: true,
            name: true,
        },
    },
    start: true,
    end: true,
    isCancelled: true,
    timetables: {
        select: {
            id: true,
            name: true,
        },
    },
};

@Injectable()
export class AppointmentsService {
    constructor(protected readonly prisma: PrismaService) {}

    async findAll(
        institutionId: string,
        dataService: DataService,
    ): Promise<ExtendedAppointments[]> {
        const appointments: Prisma.AppointmentsGetPayload<{
            select: typeof appointmentsSelect;
        }>[] = await this.prisma.appointments.findMany({
            select: {
                ...appointmentsSelect,
            },
            orderBy: [
                {
                    start: 'asc',
                },
                {
                    end: 'asc',
                },
            ],
            where: {
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
        return appointments.map((appointment) => ({
            ...appointment,
            presentators: appointment.presentators.map((presentator) => ({
                id: presentator.presentator.id,
                name: presentator.presentator.name,
                isSubstituted: presentator.isSubstituted,
            })),
        }));
    }

    async findOne(
        institutionId: string,
        dataService: DataService,
        id: string,
    ): Promise<ExtendedAppointments> {
        const appointment: Prisma.AppointmentsGetPayload<{
            select: typeof appointmentsSelect;
        }> = await this.prisma.appointments.findUniqueOrThrow({
            select: {
                ...appointmentsSelect,
            },
            where: {
                id: id,
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
        return {
            ...appointment,
            presentators: appointment.presentators.map((presentator) => ({
                id: presentator.presentator.id,
                name: presentator.presentator.name,
                isSubstituted: presentator.isSubstituted,
            })),
        };
    }
}

@Injectable()
export class AppointmentsFromTimeTablesService extends AppointmentsService {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma);
    }
    async create(
        institutionId: string,
        timetableId: string,
        createAppointmentDto: CreateAppointmentDto,
    ): Promise<{ id: string }> {
        return await this.prisma.appointments
            .create({
                select: {
                    id: true,
                },
                data: {
                    start: new Date(createAppointmentDto.start),
                    end: new Date(createAppointmentDto.end),
                    subject: {
                        connect: {
                            id: createAppointmentDto.subjectId,
                            institutionId: institutionId,
                        },
                    },
                    timetables: {
                        connect: {
                            id: timetableId,
                            institutionId: institutionId,
                        },
                    },
                },
            })
            .catch((e) => {
                if (e instanceof PrismaClientKnownRequestError) {
                    switch (e.code) {
                        case 'P2025':
                            throw new NotFoundException('Subject not found');
                    }
                }
                throw e;
            });
    }

    async update(
        institutionId: string,
        timetableId: string,
        id: string,
        updateAppointmentDto: UpdateAppointmentDto,
    ): Promise<void> {
        await this.prisma.appointments.update({
            select: {
                id: true,
            },
            data: {
                start: updateAppointmentDto.start
                    ? new Date(updateAppointmentDto.start)
                    : Prisma.skip,
                end: updateAppointmentDto.end
                    ? new Date(updateAppointmentDto.end)
                    : Prisma.skip,
                isCancelled: updateAppointmentDto.isCancelled
                    ? updateAppointmentDto.isCancelled
                    : Prisma.skip,
                subject: updateAppointmentDto.subjectId
                    ? {
                          connect: {
                              id: updateAppointmentDto.subjectId,
                              institutionId: institutionId,
                          },
                      }
                    : Prisma.skip,
            },
            where: {
                id: id,
                timetables: {
                    some: {
                        id: timetableId,
                        institutionId: institutionId,
                    },
                },
            },
        });
    }

    async remove(
        institutionId: string,
        timetableId: string,
        id: string,
    ): Promise<void> {
        await this.prisma.appointments.delete({
            select: {
                id: true,
            },
            where: {
                id: id,
                timetables: {
                    some: {
                        id: timetableId,
                        institutionId: institutionId,
                    },
                },
            },
        });
    }
}

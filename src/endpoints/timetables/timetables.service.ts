import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { TimeTables } from '@prisma/client';
import { CreateTimeTableDto } from './dto/create-timetable.dto';
import { UpdateTimeTableDto } from './dto/update-timetable.dto';
import { AppointmentsDataService } from '@app/interfaces/dataservice.interface';

const timeTablesSelect = {
    name: true,
    version: true,
    institutionId: false,
};

@Injectable()
export class TimeTablesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        institutionId: string,
        createTimetableDto: CreateTimeTableDto,
    ): Promise<void> {
        await this.prisma.timeTables.create({
            select: {
                id: true,
            },
            data: {
                institutionId: institutionId,
                ...createTimetableDto,
            },
        });
    }

    async clone(
        institutionId: string,
        id: string,
        updateTimetableDto: UpdateTimeTableDto,
    ): Promise<void> {
        await this.prisma.$transaction(async (prisma) => {
            const timetable: TimeTables & { appointments: { id: string }[] } =
                await prisma.timeTables.findUniqueOrThrow({
                    select: {
                        id: true,
                        ...timeTablesSelect,
                        appointments: {
                            select: {
                                id: true,
                            },
                        },
                    },
                    where: {
                        id: id,
                        institutionId: institutionId,
                    },
                });
            await prisma.timeTables.create({
                select: {
                    id: true,
                },
                data: {
                    institutionId: institutionId,
                    name: updateTimetableDto.name || timetable.name,
                    version: updateTimetableDto.version,
                    appointments: {
                        connect: timetable.appointments.map((appointment) => ({
                            id: appointment.id,
                        })),
                    },
                },
            });
        });
    }

    async findAll(institutionId: string): Promise<TimeTables[]> {
        return await this.prisma.timeTables.findMany({
            select: {
                id: true,
                ...timeTablesSelect,
            },
            where: {
                institutionId: institutionId,
            },
        });
    }

    async findOne(institutionId: string, id: string): Promise<TimeTables> {
        return await this.prisma.timeTables.findUniqueOrThrow({
            select: {
                id: true,
                ...timeTablesSelect,
            },
            where: {
                id: id,
                institutionId: institutionId,
            },
        });
    }

    async update(
        institutionId: string,
        id: string,
        updateTimetableDto: UpdateTimeTableDto,
    ): Promise<void> {
        await this.prisma.timeTables.update({
            select: {
                id: true,
            },
            data: updateTimetableDto,
            where: {
                id: id,
                institutionId: institutionId,
            },
        });
    }

    async remove(institutionId: string, id: string): Promise<void> {
        await this.prisma.$transaction(async (prisma) => {
            await prisma.appointments.deleteMany({
                where: {
                    timetables: {
                        every: {
                            id: id,
                            institutionId: institutionId,
                        },
                    },
                },
            });
            await prisma.timeTables.delete({
                select: {
                    id: true,
                },
                where: {
                    id: id,
                    institutionId: institutionId,
                },
            });
        });
    }
}

@Injectable()
export class TimeTablesFromAppointmentsService {
    constructor(private readonly prisma: PrismaService) {}

    async add(
        institutionId: string,
        dataService: AppointmentsDataService,
        timetableId: string,
    ): Promise<void> {
        await this.prisma.appointments.update({
            select: {
                id: true,
            },
            data: {
                timetables: {
                    connect: {
                        id: timetableId,
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
        });
    }

    async findAll(
        institutionId: string,
        dataService: AppointmentsDataService,
    ): Promise<TimeTables[]> {
        return await this.prisma.timeTables.findMany({
            select: {
                id: true,
                ...timeTablesSelect,
            },
            where: {
                institutionId: institutionId,
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
        });
    }

    async findOne(
        institutionId: string,
        dataService: AppointmentsDataService,
        timetableId: string,
    ): Promise<TimeTables> {
        return await this.prisma.timeTables.findUniqueOrThrow({
            select: {
                id: true,
                ...timeTablesSelect,
            },
            where: {
                id: timetableId,
                institutionId: institutionId,
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
        });
    }

    async remove(
        institutionId: string,
        dataService: AppointmentsDataService,
        timetableId: string,
    ): Promise<void> {
        await this.prisma.appointments.update({
            select: {
                id: true,
            },
            data: {
                timetables: {
                    disconnect: {
                        id: timetableId,
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
        });
    }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Rooms } from '@prisma/client';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AppointmentsDataService } from '@app/interfaces/DataService.interface';

const roomsSelect = {
  name: true,
  institutionId: false,
};

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

  async findAll(institutionId: string): Promise<Rooms[]> {
    return await this.prisma.rooms.findMany({
      select: {
        id: true,
        ...roomsSelect,
      },
      where: {
        institutionId: institutionId,
      },
    });
  }

  async findOne(institutionId: string, id: string): Promise<Rooms> {
    return await this.prisma.rooms.findUniqueOrThrow({
      select: {
        id: true,
        ...roomsSelect,
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
  constructor(private readonly prisma: PrismaService) {}

  async add(
    institutionId: string,
    dataService: AppointmentsDataService,
    roomId: string,
  ): Promise<void> {
    await this.prisma.appointments.update({
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
  ): Promise<Rooms[]> {
    return await this.prisma.rooms.findMany({
      select: {
        id: true,
        ...roomsSelect,
      },
      where: {
        appointments: {
          some: {
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
      },
    });
  }

  async findOne(
    institutionId: string,
    dataService: AppointmentsDataService,
    roomId: string,
  ): Promise<Rooms> {
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
    });
  }

  async findAvailableRooms(
    institutionId: string,
    dataService: AppointmentsDataService,
  ): Promise<Rooms[]> {
    return await this.prisma.$transaction(async (prisma) => {
      const appointment: { start: Date; end: Date } =
        await prisma.appointments.findUniqueOrThrow({
          select: {
            start: true,
            end: true,
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
      return await prisma.rooms.findMany({
        select: {
          id: true,
          ...roomsSelect,
        },
        where: {
          institutionId: institutionId,
          appointments: {
            some: {
              start: {
                lte: appointment.start,
              },
              end: {
                gte: appointment.end,
              },
            },
            none: {
              isCancelled: false,
            },
          },
        },
      });
    });
  }

  async remove(
    institutionId: string,
    dataService: AppointmentsDataService,
    roomId: string,
  ): Promise<void> {
    await this.prisma.appointments.update({
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

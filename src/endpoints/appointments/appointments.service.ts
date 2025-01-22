import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { TimeTablesFromGroupsService, TimeTablesFromInstitutionsService } from '../timetables/timetables.service';
import { Appointments } from '@prisma/client';
import { PresentatorsService } from '../presentators/presentators.service';
import { RoomsService } from '../rooms/rooms.service';

interface IAppointmentsService {
  create(createAppointmentDto: CreateAppointmentDto);
  findAll(institutionsId: string, dataServiceId: string, groupsId?: string): Promise<Partial<Appointments>[]>;
  findOne(institutionsId: string, dataServiceId: string, id: string, groupsId?: string): Promise<Partial<Appointments>>;
  update(id: string, updateAppointmentDto: UpdateAppointmentDto);
  remove(id: string);
}

@Injectable()
export class AppointmentsFromInstitutionsTimeTablesService implements IAppointmentsService {
  constructor(private readonly timetablesService: TimeTablesFromInstitutionsService) { }

  async create(createAppointmentDto: CreateAppointmentDto) {
    throw new Error('Method not implemented.');
  }

  async findAll(institutionsId: string, timetablesId: string) {
    return (await this.timetablesService.findOne(institutionsId, timetablesId, {
      select: {
        appointments: {
          select: {
            id: true,
            subject: true,
            presentators: true,
            rooms: true,
            dayOfWeek: true,
            start: true,
            end: true,
            isCancelled: true,
          },
        },
      }
    })).appointments;
  }

  async findOne(institutionsId: string, timetablesId: string, id: string) {
    return (await this.timetablesService.findOne(institutionsId, timetablesId, {
      select: {
        appointments: {
          select: {
            id: true,
            subject: true,
            presentators: true,
            rooms: true,
            dayOfWeek: true,
            start: true,
            end: true,
            isCancelled: true,
          },
        },
      }
    })).appointments.find((appointment) => appointment.id === id);
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    throw new Error('Method not implemented.');
  }

  async remove(id: string) {
    throw new Error('Method not implemented.');
  }
}

@Injectable()
export class AppointmentsFromGroupsTimeTablesService implements IAppointmentsService {
  constructor(private readonly timetablesService: TimeTablesFromGroupsService) { }

  async create(createAppointmentDto: CreateAppointmentDto) {
    throw new Error('Method not implemented.');
  }

  async findAll(institutionsId: string, timetablesId: string, groupsId?: string) {
    return (await this.timetablesService.findOne(institutionsId, timetablesId, {
      groupsId: groupsId,
      select: {
        appointments: {
          select: {
            id: true,
            subject: true,
            presentators: true,
            rooms: true,
            dayOfWeek: true,
            start: true,
            end: true,
            isCancelled: true,
          },
        },
      }
    })).appointments;
  }

  async findOne(institutionsId: string, timetablesId: string, id: string, groupsId?: string) {
    return (await this.timetablesService.findOne(institutionsId, timetablesId, {
      groupsId: groupsId,
      select: {
        appointments: {
          select: {
            id: true,
            subject: true,
            presentators: true,
            rooms: true,
            dayOfWeek: true,
            start: true,
            end: true,
            isCancelled: true,
          },
        },
      }
    })).appointments.find((appointment) => appointment.id === id);
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    throw new Error('Method not implemented.');
  }

  async remove(id: string) {
    throw new Error('Method not implemented.');
  }
}

@Injectable()
export class AppointmentsFromPresentatorsService implements IAppointmentsService {
  constructor(private readonly presentatorsService: PresentatorsService) { }

  async create(createAppointmentDto: CreateAppointmentDto) {
    throw new Error('Method not implemented.');
  }

  async findAll(institutionsId: string, presentatorsId: string) {
    return (await this.presentatorsService.findOne(institutionsId, presentatorsId, {
      appointments: {
        select: {
          id: true,
          subject: true,
          rooms: true,
          dayOfWeek: true,
          start: true,
          end: true,
          isCancelled: true,
          timetables: true,
        },
      },
    })).appointments;
  }

  async findOne(institutionsId: string, presentatorsId: string, id: string) {
    return (await this.presentatorsService.findOne(institutionsId, presentatorsId, {
      appointments: {
        select: {
          id: true,
          subject: true,
          rooms: true,
          dayOfWeek: true,
          start: true,
          end: true,
          isCancelled: true,
          timetables: true,
        },
      },
    })).appointments.find((appointment) => appointment.id === id);
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    throw new Error('Method not implemented.');
  }

  async remove(id: string) {
    throw new Error('Method not implemented.');
  }
}

@Injectable()
export class AppointmentsFromRoomsService implements IAppointmentsService {
  constructor(private readonly roomsService: RoomsService) { }

  async create(createAppointmentDto: CreateAppointmentDto) {
    throw new Error('Method not implemented.');
  }

  async findAll(institutionsId: string, roomsId: string) {
    return (await this.roomsService.findOne(institutionsId, roomsId, {
      appointments: {
        select: {
          id: true,
          subject: true,
          presentators: true,
          dayOfWeek: true,
          start: true,
          end: true,
          isCancelled: true,
          timetables: true,
        },
      },
    })).appointments;
  }

  async findOne(institutionsId: string, roomsId: string, id: string) {
    return (await this.roomsService.findOne(institutionsId, roomsId, {
      appointments: {
        select: {
          id: true,
          subject: true,
          presentators: true,
          dayOfWeek: true,
          start: true,
          end: true,
          isCancelled: true,
          timetables: true,
        },
      },
    })).appointments.find((appointment) => appointment.id === id);
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    throw new Error('Method not implemented.');
  }

  async remove(id: string) {
    throw new Error('Method not implemented.');
  }
}
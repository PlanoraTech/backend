import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { TimeTablesService } from 'src/endpoints/timetables/timetables.service';

@Injectable()
export class AppointmentsService {
  constructor(private readonly timetablesService: TimeTablesService) {}
  create(createAppointmentDto: CreateAppointmentDto) {
    return 'This action adds a new appointment';
  }

  async findAll(institutionsId: string, timetablesId: string) {
    return (await this.timetablesService.findOne(institutionsId, timetablesId, {
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
          timetables: true,
        },
      },
    })).appointments 
  }

  async findOne(institutionsId: string, timetablesId: string, id: string) {
    return (await this.timetablesService.findOne(institutionsId, timetablesId, {
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
          timetables: true,
        },
      },
    })).appointments.find((appointment) => appointment.id === id);
  }

  update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: string) {
    return `This action removes a #${id} appointment`;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { IAppointmentsService } from './interfaces/IAppointmentsService';

@Injectable()
export class AppointmentsService {
  constructor(@Inject('AppointmentsDataService') private readonly appointmentsService: IAppointmentsService) {}
  create(createAppointmentDto: CreateAppointmentDto) {
    return 'This action adds a new appointment';
  }

  async findAll(institutionsId: string, timetablesId: string) {
    return (await this.appointmentsService.findOne(institutionsId, timetablesId, {
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
    return (await this.appointmentsService.findOne(institutionsId, timetablesId, {
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

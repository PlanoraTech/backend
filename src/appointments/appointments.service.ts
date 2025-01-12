import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { TimeTablesService } from 'src/timetables/timetables.service';

@Injectable()
export class AppointmentsService {
  constructor(private readonly timetablesService: TimeTablesService) {}
  create(createAppointmentDto: CreateAppointmentDto) {
    return 'This action adds a new appointment';
  }

  findAll(institutionsId: string) {
    return 
  }

  async findOne(institutionsId: string, id: string) {
    return await this.timetablesService.findOne(institutionsId, id, {
      appointments: true,
    });
  }

  update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: string) {
    return `This action removes a #${id} appointment`;
  }
}

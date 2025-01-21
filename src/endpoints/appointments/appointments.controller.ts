import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller()
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll(@Param('institutionsId') institutionsId: string, @Param('timetablesId') timetablesId: string,) {
    return this.appointmentsService.findAll(institutionsId, timetablesId);
  }

  @Get(':id')
  findOne(@Param('institutionsId') institutionsId: string, @Param('timetablesId') timetablesId: string, @Param('id') id: string) {
    return this.appointmentsService.findOne(institutionsId, timetablesId, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}

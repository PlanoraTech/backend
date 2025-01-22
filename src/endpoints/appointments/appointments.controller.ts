import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentsFromGroupsTimeTablesService, AppointmentsFromInstitutionsTimeTablesService, AppointmentsFromPresentatorsService, AppointmentsFromRoomsService } from './appointments.service';

@Controller([
  'institutions/:institutionsId/timetables/:timetablesId/appointments',
])
export class AppointmentsFromTimeTablesController {
  constructor(private readonly appointmentsService: AppointmentsFromInstitutionsTimeTablesService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll(@Param('institutionsId') institutionsId: string, @Param('timetablesId') timetablesId: string) {
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

@Controller([
  'institutions/:institutionsId/groups/:groupsId/timetables/:timetablesId/appointments',
])
export class AppointmentsFromGroupsTimeTablesController {
  constructor(private readonly appointmentsService: AppointmentsFromGroupsTimeTablesService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll(@Param('institutionsId') institutionsId: string, @Param('groupsId') groupsId: string, @Param('timetablesId') timetablesId: string) {
    return this.appointmentsService.findAll(institutionsId, timetablesId, groupsId);
  }

  @Get(':id')
  findOne(@Param('institutionsId') institutionsId: string, @Param('groupsId') groupsId: string, @Param('timetablesId') timetablesId: string, @Param('id') id: string) {
    return this.appointmentsService.findOne(institutionsId, timetablesId, id, groupsId);
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

@Controller([
  'institutions/:institutionsId/presentators/:presentatorsId/appointments',
])
export class AppointmentsFromPresentatorsController {
  constructor(private readonly appointmentsService: AppointmentsFromPresentatorsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll(@Param('institutionsId') institutionsId: string, @Param('presentatorsId') presentatorsId: string) {
    return this.appointmentsService.findAll(institutionsId, presentatorsId);
  }

  @Get(':id')
  findOne(@Param('institutionsId') institutionsId: string, @Param('presentatorsId') presentatorsId: string, @Param('id') id: string) {
    return this.appointmentsService.findOne(institutionsId, presentatorsId, id);
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

@Controller([
  'institutions/:institutionsId/rooms/:roomsId/appointments',
])
export class AppointmentsFromRoomsController {
  constructor(private readonly appointmentsService: AppointmentsFromRoomsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll(@Param('institutionsId') institutionsId: string, @Param('roomsId') roomsId: string) {
    return this.appointmentsService.findAll(institutionsId, roomsId);
  }

  @Get(':id')
  findOne(@Param('institutionsId') institutionsId: string, @Param('roomsId') roomsId: string, @Param('id') id: string) {
    return this.appointmentsService.findOne(institutionsId, roomsId, id);
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
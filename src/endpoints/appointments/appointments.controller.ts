import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Appointments } from '@prisma/client';
import { AppointmentsFromTimeTablesService, AppointmentsService } from './appointments.service';
import { Access, AccessTypes } from '@app/decorators/access.decorator';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller([
	'institutions/:institutionId/presentators/:presentatorId/appointments',
	'institutions/:institutionId/rooms/:roomId/appointments',
])
export class AppointmentsController {
	constructor(protected readonly appointmentsService: AppointmentsService) { }

	@Get()
	@Access(AccessTypes.RESTRICTED)
	findAll(@Param('institutionId') institutionId: string, @Param('timetableId') timetableId: string, @Param('presentatorId') presentatorId: string, @Param('roomId') roomId: string): Promise<Appointments[]> {
		return this.appointmentsService.findAll(institutionId, {
			timetableId: timetableId,
			presentatorId: presentatorId,
			roomId: roomId,
		});
	}

	@Get(':id')
	@Access(AccessTypes.RESTRICTED)
	findOne(@Param('institutionId') institutionId: string, @Param('timetableId') timetableId: string, @Param('presentatorId') presentatorId: string, @Param('roomId') roomId: string, @Param('id') id: string): Promise<Appointments> {
		return this.appointmentsService.findOne(institutionId, {
			timetableId: timetableId,
			presentatorId: presentatorId,
			roomId: roomId,
		}, id);
	}
}

@Controller([
	'institutions/:institutionId/timetables/:timetableId/appointments',
])
export class AppointmentsFromTimeTablesController extends AppointmentsController {
	constructor(protected readonly appointmentsService: AppointmentsFromTimeTablesService) {
		super(appointmentsService);
	}

	@Post()
	@Access(AccessTypes.PRIVATE)
	create(@Param('institutionId') institutionId: string, @Body() createAppointmentDto: CreateAppointmentDto): Promise<void> {
		return this.appointmentsService.create(institutionId, createAppointmentDto);
	}

	@Patch(':id')
	@Access(AccessTypes.PRIVATE)
	update(@Param('institutionId') institutionId: string, @Param('timetableId') timetableId: string, @Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto): Promise<void> {
		return this.appointmentsService.update(institutionId, timetableId, id, updateAppointmentDto);
	}

	@Delete(':id')
	@Access(AccessTypes.PRIVATE)
	remove(@Param('institutionId') institutionId: string, @Param('timetableId') timetableId: string, @Param('id') id: string): Promise<void> {
		return this.appointmentsService.remove(institutionId, timetableId, id);
	}
}
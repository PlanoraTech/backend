import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentsFromInstitutionsTimeTablesService, AppointmentsFromPresentatorsService, AppointmentsFromRoomsService } from './appointments.service';
import { ExtendedAppointments } from './types/appointments.type';

abstract class AppointmentsController {
	constructor(private readonly appointmentsService: AppointmentsFromInstitutionsTimeTablesService | AppointmentsFromPresentatorsService | AppointmentsFromRoomsService) { }

	@Post()
	create(@Body() createAppointmentDto: CreateAppointmentDto) {
		return this.appointmentsService.create(createAppointmentDto);
	}

	@Get()
	findAll(@Param('institutionsId') institutionsId: string, @Param('timetablesId') timetablesId: string, @Param('presentatorsId') presentatorsId: string, @Param('roomsId') roomsId: string): Promise<Partial<ExtendedAppointments>[]> {
		return this.appointmentsService.findAll(institutionsId, timetablesId || presentatorsId || roomsId, {
			subject: {
				select: {
					id: true,
					name: true,
					subjectId: true,
				},
			},
			presentators: {
				select: {
					id: true,
					name: true,
				},
			},
			rooms: {
				select: {
					id: true,
					name: true,
					isAvailable: true,
				},
			},
			dayOfWeek: true,
			start: true,
			end: true,
			isCancelled: true,
		});
	}

	@Get(':id')
	findOne(@Param('institutionsId') institutionsId: string, @Param('timetablesId') timetablesId: string, @Param('presentatorsId') presentatorsId: string, @Param('roomsId') roomsId: string, @Param('id') id: string): Promise<Partial<ExtendedAppointments>> {
		return this.appointmentsService.findOne(institutionsId, timetablesId || presentatorsId || roomsId, id, {
			subject: {
				select: {
					id: true,
					name: true,
					subjectId: true,
				},
			},
			presentators: {
				select: {
					id: true,
					name: true,
				},
			},
			rooms: {
				select: {
					id: true,
					name: true,
					isAvailable: true,
				},
			},
			dayOfWeek: true,
			start: true,
			end: true,
			isCancelled: true,
		});
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
	'institutions/:institutionsId/timetables/:timetablesId/appointments',
])
export class AppointmentsFromTimeTablesController extends AppointmentsController {
	constructor() {
		super(new AppointmentsFromInstitutionsTimeTablesService);
	}
}

@Controller([
	'institutions/:institutionsId/presentators/:presentatorsId/appointments',
])
export class AppointmentsFromPresentatorsController extends AppointmentsController {
	constructor() {
		super(new AppointmentsFromPresentatorsService);
	}
}

@Controller([
	'institutions/:institutionsId/rooms/:roomsId/appointments',
])
export class AppointmentsFromRoomsController extends AppointmentsController {
	constructor() {
		super(new AppointmentsFromRoomsService);
	}
}
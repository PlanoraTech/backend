import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentsFromInstitutionsTimeTablesService, AppointmentsFromPresentatorsService, AppointmentsFromRoomsService } from './appointments.service';
import { Access, AccessTypes } from 'src/decorators/access.decorator';
import { Appointments, PrismaClient } from '@prisma/client';

abstract class AppointmentsController {
	constructor(private readonly appointmentsService: AppointmentsFromInstitutionsTimeTablesService | AppointmentsFromPresentatorsService | AppointmentsFromRoomsService) { }

	@Get()
	@Access(AccessTypes.RESTRICTED)
	findAll(@Param('institutionsId') institutionsId: string, @Param('timetablesId') timetablesId: string, @Param('presentatorsId') presentatorsId: string, @Param('roomsId') roomsId: string): Promise<Partial<Appointments>[]> {
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
					presentator: {
						select: {
							id: true,
							name: true,
						},
					},
					isSubstituted: true,
				}
			},
			rooms: {
				select: {
					id: true,
					name: true,
				},
			},
			dayOfWeek: true,
			start: true,
			end: true,
			isCancelled: true,
		});
	}

	@Get(':id')
	@Access(AccessTypes.RESTRICTED)
	findOne(@Param('institutionsId') institutionsId: string, @Param('timetablesId') timetablesId: string, @Param('presentatorsId') presentatorsId: string, @Param('roomsId') roomsId: string, @Param('id') id: string): Promise<Partial<Appointments>> {
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
					presentator: {
						select: {
							id: true,
							name: true,
						},
					},
					isSubstituted: true,
				}
			},
			rooms: {
				select: {
					id: true,
					name: true,
				},
			},
			dayOfWeek: true,
			start: true,
			end: true,
			isCancelled: true,
		});
	}
}


@Controller([
	'institutions/:institutionsId/timetables/:timetablesId/appointments',
])
export class AppointmentsFromTimeTablesController extends AppointmentsController {
	constructor(private readonly timetableService: AppointmentsFromInstitutionsTimeTablesService) {
		super(new AppointmentsFromInstitutionsTimeTablesService(new PrismaClient));
	}

	@Post()
	@Access(AccessTypes.PRIVATE)
	create(@Param('institutionsId') institutionsId: string, @Param('timetablesId') timetablesId: string, @Body() createAppointmentDto: CreateAppointmentDto) {
		return this.timetableService.create(institutionsId, timetablesId, createAppointmentDto);
	}

	@Patch(':id')
	@Access(AccessTypes.PRIVATE)
	update(@Param('institutionsId') institutionsId: string, @Param('timetablesId') timetablesId: string, @Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
		return this.timetableService.update(institutionsId, timetablesId, id, updateAppointmentDto);
	}

	@Delete(':id')
	@Access(AccessTypes.PRIVATE)
	remove(@Param('institutionsId') institutionsId: string, @Param('timetablesId') timetablesId: string, @Param('id') id: string) {
		return this.timetableService.remove(institutionsId, timetablesId, id);
	}
}

@Controller([
	'institutions/:institutionsId/presentators/:presentatorsId/appointments',
])
export class AppointmentsFromPresentatorsController extends AppointmentsController {
	constructor() {
		super(new AppointmentsFromPresentatorsService(new PrismaClient));
	}
}

@Controller([
	'institutions/:institutionsId/rooms/:roomsId/appointments',
])
export class AppointmentsFromRoomsController extends AppointmentsController {
	constructor() {
		super(new AppointmentsFromRoomsService(new PrismaClient));
	}
}
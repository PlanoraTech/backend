import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Appointments } from '@prisma/client';
import { AppointmentsFromTimeTablesService, AppointmentsService } from './appointments.service';
import { Access, AccessTypes } from '../../decorators/access.decorator';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller([
	'institutions/:institutionId/presentators/:presentatorId/appointments',
	'institutions/:institutionId/rooms/:roomId/appointments',
])
export class AppointmentsController {
	constructor(private readonly appointmentsService: AppointmentsService) { }

	@Get()
	@Access(AccessTypes.RESTRICTED)
	findAll(@Param('institutionId') institutionId: string, @Param('timetableId') timetableId: string, @Param('presentatorId') presentatorId: string, @Param('roomId') roomId: string): Promise<Partial<Appointments>[]> {
		return this.appointmentsService.findAll(institutionId, {
			timetableId: timetableId,
			presentatorId: presentatorId,
			roomId: roomId,
		}, {
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
			start: true,
			end: true,
			isCancelled: true,
		});
	}

	@Get(':id')
	@Access(AccessTypes.RESTRICTED)
	findOne(@Param('institutionId') institutionId: string, @Param('timetableId') timetableId: string, @Param('presentatorId') presentatorId: string, @Param('roomId') roomId: string, @Param('id') id: string): Promise<Partial<Appointments>> {
		return this.appointmentsService.findOne(institutionId, {
			timetableId: timetableId,
			presentatorId: presentatorId,
			roomId: roomId,
		}, id, {
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
			start: true,
			end: true,
			isCancelled: true,
		});
	}
}

@Controller([
	'institutions/:institutionId/timetables/:timetableId/appointments',
])
export class AppointmentsFromTimeTablesController extends AppointmentsController {
	constructor(private readonly timetableService: AppointmentsFromTimeTablesService) {
		super(new AppointmentsService(new PrismaService));
	}

	@Post()
	@Access(AccessTypes.PRIVATE)
	create(@Param('institutionId') institutionId: string, @Param('timetableId') timetableId: string, @Body() createAppointmentDto: CreateAppointmentDto): Promise<void> {
		return this.timetableService.create(institutionId, timetableId, createAppointmentDto);
	}

	@Patch(':id')
	@Access(AccessTypes.PRIVATE)
	update(@Param('institutionId') institutionId: string, @Param('timetableId') timetableId: string, @Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto): Promise<void> {
		return this.timetableService.update(institutionId, timetableId, id, updateAppointmentDto);
	}

	@Delete(':id')
	@Access(AccessTypes.PRIVATE)
	remove(@Param('institutionId') institutionId: string, @Param('timetableId') timetableId: string, @Param('id') id: string): Promise<void> {
		return this.timetableService.remove(institutionId, timetableId, id);
	}
}
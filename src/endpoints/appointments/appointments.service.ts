import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { TimeTablesService } from '../timetables/timetables.service';
import { PresentatorsService } from '../presentators/presentators.service';
import { RoomsService } from '../rooms/rooms.service';
import { InstitutionsService } from '../institutions/institutions.service';
import { PrismaClient } from '@prisma/client';

abstract class AppointmentsService {
	constructor(private readonly appointmentsService: TimeTablesService | PresentatorsService | RoomsService) { };
	async create(createAppointmentDto: CreateAppointmentDto) {
		throw new Error('Method not implemented.');
	}

	async findAll(institutionsId: string, appointmentsServiceId: string) {
		return (await this.appointmentsService.findOne(institutionsId, appointmentsServiceId, {
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
		})).appointments;
	}

	async findOne(institutionsId: string, appointmentsServiceId: string, id: string) {
		return (await this.appointmentsService.findOne(institutionsId, appointmentsServiceId, {
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
export class AppointmentsFromInstitutionsTimeTablesService extends AppointmentsService {
	constructor() {
		super(new TimeTablesService);
	}
}

@Injectable()
export class AppointmentsFromPresentatorsService extends AppointmentsService {
	constructor() {
		super(new PresentatorsService(new InstitutionsService(new PrismaClient)));
	}
}

@Injectable()
export class AppointmentsFromRoomsService extends AppointmentsService {
	constructor() {
		super(new RoomsService(new InstitutionsService(new PrismaClient)));
	}
}
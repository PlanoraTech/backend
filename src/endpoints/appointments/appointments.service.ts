import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { TimeTablesService } from '../timetables/timetables.service';
import { PresentatorsService } from '../presentators/presentators.service';
import { RoomsService } from '../rooms/rooms.service';
import { PrismaClient } from '@prisma/client';
import { ExtendedAppointments } from './types/appointments.type';

abstract class AppointmentsService {
	constructor(private readonly appointmentsService: TimeTablesService | PresentatorsService | RoomsService) { };
	async create(createAppointmentDto: CreateAppointmentDto) {
		throw new Error('Method not implemented.');
	}

	async findAll(institutionsId: string, appointmentsServiceId: string, select?: {
		subject?: {
			select: {
				id?: boolean,
				name?: boolean,
				subjectId?: boolean,
			}
		},
		presentators?: {
			select: {
				id: boolean,
				presentator: {
					select: {
						name: boolean,
					}
				},
				isSubstituted: boolean,
			}
		}
		rooms?: {
			select: {
				id?: boolean,
				name?: boolean,
				isAvailable?: boolean,
			}
		},
		dayOfWeek?: boolean,
		start?: boolean,
		end?: boolean,
		isCancelled?: boolean,
		timetables?: boolean,
	}): Promise<Partial<ExtendedAppointments>[]> {
		return (await this.appointmentsService.findOne(institutionsId, appointmentsServiceId, {
			appointments: {
				select: {
					id: true,
					...select,
				},
			},
		})).appointments;
	}

	async findOne(institutionsId: string, appointmentsServiceId: string, id: string, select?: {
		subject?: {
			select: {
				id?: boolean,
				name?: boolean,
				subjectId?: boolean,
			}
		},
		presentators?: {
			select: {
				id: boolean,
				presentator: {
					select: {
						name: boolean,
					}
				},
				isSubstituted: boolean,
			}
		}
		rooms?: {
			select: {
				id?: boolean,
				name?: boolean,
				isAvailable?: boolean,
			}
		},
		dayOfWeek?: boolean,
		start?: boolean,
		end?: boolean,
		isCancelled?: boolean,
		timetables?: boolean,
	}): Promise<Partial<ExtendedAppointments>> {
		return (await this.appointmentsService.findOne(institutionsId, appointmentsServiceId, {
			appointments: {
				select: {
					id: true,
					...select,
				},
			},
		})).appointments.find((appointment) => appointment.id === id);
	}

	async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
		throw new Error('Method not implemented.');
	}

	async remove(id: string) {
		
	}
}

@Injectable()
export class AppointmentsFromInstitutionsTimeTablesService extends AppointmentsService {
	constructor() {
		super(new TimeTablesService(new PrismaClient));
	}
}

@Injectable()
export class AppointmentsFromPresentatorsService extends AppointmentsService {
	constructor() {
		super(new PresentatorsService(new PrismaClient));
	}
}

@Injectable()
export class AppointmentsFromRoomsService extends AppointmentsService {
	constructor() {
		super(new RoomsService(new PrismaClient));
	}
}
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Appointments } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { DataService } from '@app/interfaces/DataService.interface';

const appointmentsSelect = {
	subjectId: false,
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
		},
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
	timetables: {
		select: {
			id: true,
			name: true,
		},
	},
}

interface ExtendedAppointments extends Appointments {
	subject: {
		id: string,
		name: string,
		subjectId: string,
	},
	rooms: {
		id: string,
		name: string,
	}[],
	timetables: {
		id: string,
		name: string,
	}[],
}

interface ExtendedAppointmentsWithPrismaPresentators extends ExtendedAppointments {
	presentators: {
		presentator: {
			id: string,
			name: string,
		},
		isSubstituted: boolean,
	}[],
}

interface ExtendedAppointmentsWithPresentators extends ExtendedAppointments {
	presentators: {
		id: string,
		name: string,
		isSubstituted: boolean,
	}[],
}

@Injectable()
export class AppointmentsService {
	constructor(protected readonly prisma: PrismaService) { }

	async findAll(institutionId: string, dataService: DataService): Promise<ExtendedAppointmentsWithPresentators[]> {
		const appointments: ExtendedAppointmentsWithPrismaPresentators[] = await this.prisma.appointments.findMany({
			select: {
				id: true,
				...appointmentsSelect,
			},
			orderBy: [
				{
					start: 'asc',
				},
				{
					end: 'asc',
				},
			],
			where: {
				timetables: {
					some: {
						id: dataService.timetableId,
						institutionId: institutionId,
					},
				},
				rooms: {
					some: {
						id: dataService.roomId,
						institutionId: institutionId,
					},
				},
				presentators: {
					some: {
						presentator: {
							id: dataService.presentatorId,
							institutions: {
								some: {
									id: institutionId,
								},
							},
						},
					},
				},
			},
		})
		return appointments.map((appointment) => ({
			...appointment,
			presentators: appointment.presentators.map((presentator) => ({
				id: presentator.presentator.id,
				name: presentator.presentator.name,
				isSubstituted: presentator.isSubstituted,
			})),
		}))
	};

	async findOne(institutionId: string, dataService: DataService, id: string): Promise<ExtendedAppointmentsWithPresentators> {
		const appointment: ExtendedAppointmentsWithPrismaPresentators = await this.prisma.appointments.findUniqueOrThrow({
			select: {
				id: true,
				...appointmentsSelect,
			},
			where: {
				id: id,
				timetables: {
					some: {
						id: dataService.timetableId,
						institutionId: institutionId,
					},
				},
				rooms: {
					some: {
						id: dataService.roomId,
						institutionId: institutionId,
					},
				},
				presentators: {
					some: {
						presentator: {
							id: dataService.presentatorId,
							institutions: {
								some: {
									id: institutionId,
								},
							},
						},
					},
				},
			},
		})
		return {
			...appointment,
			presentators: appointment.presentators.map((presentator) => ({
				id: presentator.presentator.id,
				name: presentator.presentator.name,
				isSubstituted: presentator.isSubstituted,
			})),
		}
	};
}

@Injectable()
export class AppointmentsFromTimeTablesService extends AppointmentsService {
	constructor(protected readonly prisma: PrismaService) {
		super(prisma);
	}
	async create(institutionId: string, createAppointmentDto: CreateAppointmentDto): Promise<void> {
		await this.prisma.appointments.create({
			data: {
				start: new Date(createAppointmentDto.start),
				end: new Date(createAppointmentDto.end),
				isCancelled: createAppointmentDto.isCancelled,
				subject: {
					connect: {
						id: createAppointmentDto.subjectId,
						institutionId: institutionId,
					},
				},
			},
		});
	}

	async update(institutionId: string, timetableId: string, id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<void> {
		await this.prisma.appointments.update({
			select: {
				id: true,
			},
			data: {
				start: (updateAppointmentDto.start) ? new Date(updateAppointmentDto.start) : undefined,
				end: (updateAppointmentDto.end) ? new Date(updateAppointmentDto.end) : undefined,
				isCancelled: updateAppointmentDto.isCancelled,
				subject: (updateAppointmentDto.subjectId) ? {
					connect: {
						id: updateAppointmentDto.subjectId,
						institutionId: institutionId,
					},
				} : undefined,
			},
			where: {
				id: id,
				timetables: {
					some: {
						id: timetableId,
						institutionId: institutionId,
					},
				},
			},
		});
	}

	async remove(institutionId: string, timetableId: string, id: string): Promise<void> {
		await this.prisma.appointments.delete({
			select: {
				id: true,
			},
			where: {
				id: id,
				timetables: {
					some: {
						id: timetableId,
						institutionId: institutionId,
					},
				},
			},
		});
	}
}
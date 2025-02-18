import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Appointments } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { DataServiceIds } from 'src/interfaces/DataServiceIds';

interface AppointmentsSelect {
	id?: boolean,
	subject?: {
		select: {
			id?: boolean,
			name?: boolean,
			subjectId?: boolean,
		}
	},
	presentators?: {
		select: {
			presentator: {
				select: {
					id: boolean,
					name: boolean,
				},
			},
			isSubstituted: boolean,
		}
	}
	rooms?: {
		select: {
			id?: boolean,
			name?: boolean,
		}
	},
	start?: boolean,
	end?: boolean,
	isCancelled?: boolean,
	timetables?: {
		select: {
			id?: boolean,
		}
	},
}

@Injectable()
export class AppointmentsService {
	constructor(protected readonly prisma: PrismaService) { }

	async findAll(institutionId: string, dataServiceIds: DataServiceIds, select?: AppointmentsSelect): Promise<Partial<Appointments>[]> {
		let appointments = await this.prisma.appointments.findMany({
			select: {
				id: true,
				...select,
			},
			where: {
				timetables: {
					some: {
						id: dataServiceIds.timetableId,
						institutionId: institutionId,
					},
				},
				rooms: {
					some: {
						id: dataServiceIds.roomId,
						institutionId: institutionId,
					},
				},
				presentators: {
					some: {
						presentator: {
							id: dataServiceIds.presentatorId,
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

	async findOne(institutionId: string, dataServiceIds: DataServiceIds, id: string, select?: AppointmentsSelect) {
		let appointment = await this.prisma.appointments.findUniqueOrThrow({
			select: {
				id: true,
				...select,
			},
			where: {
				timetables: {
					some: {
						id: dataServiceIds.timetableId,
						institutionId: institutionId,
					},
				},
				rooms: {
					some: {
						id: dataServiceIds.roomId,
						institutionId: institutionId,
					},
				},
				presentators: {
					some: {
						presentator: {
							id: dataServiceIds.presentatorId,
							institutions: {
								some: {
									id: institutionId,
								},
							},
						},
					},
				},
				id: id,
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
	constructor() {
		super(new PrismaService);
	}
	async create(institutionId: string, timetableId: string, createAppointmentDto: CreateAppointmentDto): Promise<void> {
		await this.prisma.appointments.create({
			data: {
				start: createAppointmentDto.start,
				end: createAppointmentDto.end,
				isCancelled: createAppointmentDto.isCancelled,
				timetables: {
					connect: {
						id: timetableId,
						institutionId: institutionId,
					},
				},
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
				start: updateAppointmentDto.start,
				end: updateAppointmentDto.end,
				isCancelled: updateAppointmentDto.isCancelled,
				timetables: {
					connect: {
						id: timetableId,
						institutionId: institutionId,
					},
				},
				subject: {
					connect: {
						id: updateAppointmentDto.subjectId,
						institutionId: institutionId,
					},
				},
			},
			where: {
				id: id,
			},
		});
	}
	
	async remove(institutionId: string, timetableId: string, id: string): Promise<void> {
		await this.prisma.appointments.delete({
			select: {
				id: true,
			},
			where: {
				timetables: {
					some: {
						id: timetableId,
						institutionId: institutionId,
					},
				},
				id: id,
			},
		});
	}
}
import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointments, PrismaClient } from '@prisma/client';

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
	timetables?: boolean,
}

interface DataServiceIds {
	timetableId?: string,
	presentatorId?: string,
	roomId?: string,
}

abstract class AppointmentsService {
	constructor(protected readonly prisma: PrismaClient) { }

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
					}
				},
				rooms: {
					some: {
						id: dataServiceIds.roomId,
						institutionId: institutionId,
					}
				},
				presentators: {
					some: {
						presentator: {
							id: dataServiceIds.presentatorId,
							institutionId: institutionId,
						}
					}
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
					}
				},
				rooms: {
					some: {
						id: dataServiceIds.roomId,
						institutionId: institutionId,
					}
				},
				presentators: {
					some: {
						presentator: {
							id: dataServiceIds.presentatorId,
							institutionId: institutionId,
						}
					}
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
export class AppointmentsFromInstitutionsTimeTablesService extends AppointmentsService {
	constructor() {
		super(new PrismaClient);
	}
	async create(institutionId: string, timetableId: string, createAppointmentDto: CreateAppointmentDto) {
		let appointment = await this.prisma.appointments.create({
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
						id: createAppointmentDto.subject.id,
						institutionId: institutionId,
					},
				},
			},
		});
		createAppointmentDto.presentators.map((presentator) => this.prisma.presentatorsToAppointments.create({
			data: {
				appointment: {
					connect: {
						id: appointment.id,
					}
				},
				presentator: {
					connect: {
						id: presentator.id,
						institutionId: institutionId,
					}
				},
				isSubstituted: presentator.isSubstituted,
			}
		}));
	}

	async update(institutionId: string, timetableId: string, id: string, updateAppointmentDto: UpdateAppointmentDto) {
		await this.prisma.$transaction([
			this.prisma.appointments.update({
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
							id: updateAppointmentDto.subject.id,
							institutionId: institutionId,
						},
					},
				},
				where: {
					id: id,
				}
			}),
			this.prisma.presentatorsToAppointments.updateMany({
				where: {
					appointment: {
						id: id,
						timetables: {
							some: {
								id: timetableId,
								institutionId: institutionId,
							}
						}
					}
				},
				data: updateAppointmentDto.presentators.map((presentator) => ({
					presentator: {
						connect: {
							id: presentator.id,
							institutionId: institutionId,
						}
					},
					isSubstituted: presentator.isSubstituted,
				}))
			})
		])
	}
	async remove(institutionId: string, timetableId: string, id: string) {
		await this.prisma.appointments.delete({
			where: {
				timetables: {
					some: {
						id: timetableId,
						institutionId: institutionId,
					}
				},
				id: id,
			},
		});
	}
}

@Injectable()
export class AppointmentsFromPresentatorsService extends AppointmentsService {
	constructor() {
		super(new PrismaClient);
	}
}

@Injectable()
export class AppointmentsFromRoomsService extends AppointmentsService {
	constructor() {
		super(new PrismaClient)
	}
}
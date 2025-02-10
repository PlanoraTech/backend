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
	dayOfWeek?: boolean,
	start?: boolean,
	end?: boolean,
	isCancelled?: boolean,
	timetables?: boolean,
}

@Injectable()
export class AppointmentsFromInstitutionsTimeTablesService {
	constructor(private readonly prisma: PrismaClient) { }
	async create(institutionsId: string, timetablesId: string, createAppointmentDto: CreateAppointmentDto) {
		/*
		await this.prisma.$transaction([
			this.prisma.appointments.create({
				data: {
					start: createAppointmentDto.start,
					end: createAppointmentDto.end,
					dayOfWeek: createAppointmentDto.dayOfWeek,
					isCancelled: createAppointmentDto.isCancelled,
					timetables: {
						connect: {
							id: timetablesId,
							institutionId: institutionsId,
						},
					},
					subject: {
						connect: {
							id: createAppointmentDto.subject.id,
							institutionId: institutionsId,
						},
					},
				},
			}),
			this.prisma.presentatorsToAppointments.createMany({
				data: createAppointmentDto.presentators.map((presentator) => ({
					presentator: {
						connect: {
							id: presentator.id,
							institutionsId: institutionsId,
						},
					},
					isSubstituted: presentator.isSubstituted,
				})),
			}),
		]);
		*/
	}

	async findAll(institutionsId: string, timetablesId: string, select?: AppointmentsSelect): Promise<Partial<Appointments>[]> {
		let appointments = await this.prisma.appointments.findMany({
			select: {
				id: true,
				...select,
			},
			where: {
				timetables: {
					some: {
						id: timetablesId,
						institutionId: institutionsId,
					}
				},
			},
		});
		return appointments.map((appointment) => ({
			...appointment,
			presentators: appointment.presentators.map((presentator) => ({
				id: presentator.presentator.id,
				name: presentator.presentator.name,
				isSubstituted: presentator.isSubstituted,
			})),
		}))
	}

	async findOne(institutionsId: string, appointmentsServiceId: string, id: string, select?: AppointmentsSelect) {
		let appointment = await this.prisma.appointments.findUniqueOrThrow({
			select: {
				id: true,
				...select,
			},
			where: {
				timetables: {
					some: {
						id: appointmentsServiceId,
						institutionId: institutionsId,
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
	}

	async update(institutionsId: string, timetablesId: string, id: string, updateAppointmentDto: UpdateAppointmentDto) {
		await this.prisma.$transaction([
			this.prisma.appointments.update({
				data: {
					start: updateAppointmentDto.start,
					end: updateAppointmentDto.end,
					dayOfWeek: updateAppointmentDto.dayOfWeek,
					isCancelled: updateAppointmentDto.isCancelled,
					timetables: {
						connect: {
							id: timetablesId,
							institutionId: institutionsId,
						},
					},
					subject: {
						connect: {
							id: updateAppointmentDto.subject.id,
							institutionId: institutionsId,
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
								id: timetablesId,
								institutionId: institutionsId,
							}
						}
					}
				},
				data: updateAppointmentDto.presentators.map((presentator) => ({
					presentator: {
						connect: {
							id: presentator.id,
							institutionsId: institutionsId,
						}
					},
					isSubstituted: presentator.isSubstituted,
				}))
			})
		])
	}
	async remove(institutionsId: string, timetablesId: string, id: string) {
		await this.prisma.appointments.delete({
			where: {
				timetables: {
					some: {
						id: timetablesId,
						institutionId: institutionsId,
					}
				},
				id: id,
			},
		});
	}
}

@Injectable()
export class AppointmentsFromPresentatorsService {
	constructor(private readonly prisma: PrismaClient) { }

	async findAll(institutionsId: string, presentatorsId: string, select?: AppointmentsSelect) {
		let appointments = await this.prisma.appointments.findMany({
			select: {
				id: true,
				...select,
			},
			where: {
				presentators: {
					some: {
						presentator: {
							id: presentatorsId,
							institutionId: institutionsId,
						}
					}
				},
			}
		});
		return appointments.map((appointment) => ({
			...appointment,
			presentators: appointment.presentators.map((presentator) => ({
				id: presentator.presentator.id,
				name: presentator.presentator.name,
				isSubstituted: presentator.isSubstituted,
			})),
		}))
	}

	async findOne(institutionsId: string, presentatorsId: string, id: string, select?: AppointmentsSelect) {
		let appointment = await this.prisma.appointments.findUniqueOrThrow({
			select: {
				id: true,
				...select,
			},
			where: {
				presentators: {
					some: {
						presentator: {
							id: presentatorsId,
							institutionId: institutionsId,
						}
					}
				},
				id: id,
			}
		});
		return {
			...appointment,
			presentators: appointment.presentators.map((presentator) => ({
				id: presentator.presentator.id,
				name: presentator.presentator.name,
				isSubstituted: presentator.isSubstituted,
			})),
		}
	}
}

@Injectable()
export class AppointmentsFromRoomsService {
	constructor(private readonly prisma: PrismaClient) { }

	async findAll(institutionsId: string, roomsId: string, select?: AppointmentsSelect) {
		let appointments = await this.prisma.appointments.findMany({
			select: {
				id: true,
				...select,
			},
			where: {
				rooms: {
					some: {
						id: roomsId,
						institutionId: institutionsId,
					}
				}
			}
		});
		return appointments.map((appointment) => ({
			...appointment,
			presentators: appointment.presentators.map((presentator) => ({
				id: presentator.presentator.id,
				name: presentator.presentator.name,
				isSubstituted: presentator.isSubstituted,
			})),
		}))
	}

	async findOne(institutionsId: string, roomsId: string, id: string, select?: AppointmentsSelect) {
		let appointment = await this.prisma.appointments.findUniqueOrThrow({
			select: {
				id: true,
				...select,
			},
			where: {
				rooms: {
					some: {
						id: roomsId,
						institutionId: institutionsId,
					}
				},
				id: id,
			}
		});
		return {
			...appointment,
			presentators: appointment.presentators.map((presentator) => ({
				id: presentator.presentator.id,
				name: presentator.presentator.name,
				isSubstituted: presentator.isSubstituted,
			})),
		}
	}
}
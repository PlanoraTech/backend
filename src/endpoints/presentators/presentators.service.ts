import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Presentators, Roles } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreatePresentatorDto } from './dto/create-presentator.dto';
import { AppointmentsDataService } from '@app/interfaces/DataService.interface';
import { UpdateSubstitutionDto, UpdateSubstitutionsDto } from './dto/update-substitution.dto';

const presentatorsSelect = {
	name: true,
}

@Injectable()
export class PresentatorsService {
	constructor(private readonly prisma: PrismaService) { }

	async create(institutionId: string, createPresentatorDto: CreatePresentatorDto): Promise<void> {
		await this.prisma.$transaction(async (prisma) => {
			await prisma.presentators.create({
				data: {
					name: createPresentatorDto.name,
					institutions: {
						connect: {
							id: institutionId,
						},
					},
				},
			}).catch((e) => {
				if (e instanceof PrismaClientKnownRequestError) {
					if (e.code === 'P2002') return;
				}
				throw e;
			});
			if (createPresentatorDto.email) {
				await prisma.usersToInstitutions.create({
					data: {
						role: Roles.PRESENTATOR,
						user: {
							connect: {
								email: createPresentatorDto.email,
							},
						},
						institution: {
							connect: {
								id: institutionId,
							},
						},
						presentator: {
							connect: {
								name: createPresentatorDto.name,
							},
						},
					},
				}).catch((e) => {
					if (e instanceof PrismaClientKnownRequestError) {
						if (e.code === 'P2002') throw new ConflictException('The given email is already assigned to a presentator');
						if (e.code === 'P2025') throw new NotFoundException('The given email is not assigned to an account');
					}
					throw e;
				});
			}
		});
	}

	async findAll(institutionId: string): Promise<Presentators[]> {
		return await this.prisma.presentators.findMany({
			select: {
				id: true,
				...presentatorsSelect,
			},
			where: {
				institutions: {
					some: {
						id: institutionId,
					},
				},
			},
		});
	}

	async findOne(institutionId: string, id: string): Promise<Presentators> {
		return await this.prisma.presentators.findUniqueOrThrow({
			select: {
				id: true,
				...presentatorsSelect,
			},
			where: {
				id: id,
				institutions: {
					some: {
						id: institutionId,
					},
				},
			},
		});
	}

	async substitute(institutionId: string, id: string, substitutionDto: UpdateSubstitutionsDto): Promise<void> {
		await this.prisma.$transaction(async (prisma) => {
			let appointments = await prisma.appointments.findMany({
				where: {
					start: {
						gte: new Date(substitutionDto.from),
						lte: new Date(substitutionDto.to),
					},
					end: {
						gte: new Date(substitutionDto.from),
						lte: new Date(substitutionDto.to),
					},
					presentators: {
						some: {
							presentator: {
								id: id,
								institutions: {
									some: {
										id: institutionId,
									},
								},
							},
						},
					},
				},
			});
			await prisma.presentatorsToAppointments.updateMany({
				data: {
					isSubstituted: substitutionDto.isSubstituted,
				},
				where: {
					appointmentId: {
						in: appointments.map(appointment => appointment.id),
					},
					presentator: {
						id: id,
						institutions: {
							some: {
								id: institutionId,
							},
						},
					},
				},
			});
		});
	}

	async remove(institutionId: string, id: string): Promise<void> {
		await this.prisma.presentators.update({
			select: {
				id: true,
			},
			data: {
				institutions: {
					disconnect: {
						id: institutionId,
					},
				},
			},
			where: {
				id: id,
				institutions: {
					some: {
						id: institutionId,
					},
				},
			},
		});
		await this.prisma.usersToInstitutions.delete({
			where: {
				presentatorId: id,
				user: {
					institutions: {
						some: {
							institutionId: institutionId,
						},
					},
				},
			},
		}).catch((e) => {
			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2025') return;
			}
			throw e;
		});
		await this.prisma.presentators.delete({
			select: {
				id: true,
			},
			where: {
				id: id,
				institutions: {
					none: {}
				},
			},
		}).catch((e) => {
			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2025') return;
			}
			throw e;
		});
	}
}

@Injectable()
export class PresentatorsFromAppointmentsService {
	constructor(private readonly prisma: PrismaService) { }

	async add(institutionId: string, dataService: AppointmentsDataService, presentatorId: string): Promise<void> {
		await this.prisma.appointments.update({
			data: {
				presentators: {
					connect: {
						presentatorId_appointmentId: {
							presentatorId: presentatorId,
							appointmentId: dataService.appointmentId,
						},
					},
				},
			},
			where: {
				id: dataService.appointmentId,
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
		});
	}

	async findAll(institutionId: string, dataService: AppointmentsDataService): Promise<Presentators[]> {
		return await this.prisma.presentators.findMany({
			select: {
				id: true,
				...presentatorsSelect,
			},
			where: {
				appointments: {
					some: {
						appointmentId: dataService.appointmentId,
						appointment: {
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
					},
				},
			},
		});
	}

	async findOne(institutionId: string, dataService: AppointmentsDataService, presentatorId: string): Promise<Presentators> {
		return await this.prisma.presentators.findUniqueOrThrow({
			select: {
				id: true,
				...presentatorsSelect,
			},
			where: {
				id: presentatorId,
				appointments: {
					some: {
						appointmentId: dataService.appointmentId,
						appointment: {
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
					},
				},
			},
		});
	}

	async substitute(institutionId: string, dataService: AppointmentsDataService, presentatorId: string, substitutionDto: UpdateSubstitutionDto): Promise<void> {
		await this.prisma.presentatorsToAppointments.update({
			data: {
				isSubstituted: substitutionDto.isSubstituted,
			},
			where: {
				presentatorId_appointmentId: {
					presentatorId: presentatorId,
					appointmentId: dataService.appointmentId,
				},
				appointment: {
					id: dataService.appointmentId,
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
				}
			}
		});
	}

	async remove(institutionId: string, dataService: AppointmentsDataService, presentatorId: string): Promise<void> {
		await this.prisma.appointments.update({
			data: {
				presentators: {
					disconnect: {
						presentatorId_appointmentId: {
							presentatorId: presentatorId,
							appointmentId: dataService.appointmentId,
						},
					},
				},
			},
			where: {
				id: dataService.appointmentId,
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
		});
	}
}
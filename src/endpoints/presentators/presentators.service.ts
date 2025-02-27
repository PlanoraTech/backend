import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Presentators, Roles } from '@prisma/client';
import { CreatePresentatorDto } from './dto/create-presentator.dto';
import { DataServiceIds } from 'src/interfaces/DataServiceIds';
import { UpdateSubstitutionDto } from './dto/update-substitution.dto';

interface PresentatorsSelect {
	name?: boolean,
}

@Injectable()
export class PresentatorsService {
	constructor(private readonly prisma: PrismaService) { }

	async create(institutionId: string, createPresentatorDto: CreatePresentatorDto): Promise<void> {
		await this.prisma.presentators.create({
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
		if (createPresentatorDto.email)
		{
			await this.prisma.usersToInstitutions.create({
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
					}
				}
			}).catch((e) => {
				if (e instanceof PrismaClientKnownRequestError) {
					if (e.code === 'P2002') throw new ConflictException('The given email is already assigned to a presentator');
					if (e.code === 'P2025') throw new NotFoundException('The given email is not assigned to an account');
				}
				throw e;
			});
		}
	}

	async findAll(institutionId: string, select?: PresentatorsSelect): Promise<Partial<Presentators>[]> {
		return await this.prisma.presentators.findMany({
			select: {
				id: true,
				...select,
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

	async findOne(institutionId: string, id: string, select?: PresentatorsSelect): Promise<Partial<Presentators>> {
		return await this.prisma.presentators.findUniqueOrThrow({
			select: {
				id: true,
				...select,
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

	async remove(institutionId: string, id: string): Promise<void> {
		await this.prisma.presentators.update({
			data: {
				user: {
					disconnect: {
						institution: {
							id: institutionId,
						},
						presentator: {
							id: id,
						}
					}
				},
				institutions: {
					disconnect: {
						id: institutionId,
					}
				}
			},
			where: {
				id: id,
				institutions: {
					some: {
						id: institutionId,
					},
				},
			},
		})
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
		});
	}
}

@Injectable()
export class PresentatorsFromAppointmentsService {
	constructor(private readonly prisma: PrismaService) { }

	async add(institutionId: string, dataServiceIds: DataServiceIds, presentatorId: string): Promise<void> {
		await this.prisma.appointments.update({
			data: {
				presentators: {
					connect: {
						presentatorId_appointmentId: {
							presentatorId: presentatorId,
							appointmentId: dataServiceIds.appointmentId,
						},
					},
				},
			},
			where: {
				id: dataServiceIds.appointmentId,
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
		});
	}

	async findAll(institutionId: string, dataServiceIds: DataServiceIds, select?: PresentatorsSelect): Promise<Partial<Presentators>[]> {
		return await this.prisma.presentators.findMany({
			select: {
				id: true,
				...select,
			},
			where: {
				appointments: {
					some: {
						appointmentId: dataServiceIds.appointmentId,
						appointment: {
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
					},
				},
			},
		});
	}

	async findOne(institutionId: string, dataServiceIds: DataServiceIds, presentatorId: string, select?: PresentatorsSelect): Promise<Partial<Presentators>> {
		return await this.prisma.presentators.findUniqueOrThrow({
			select: {
				id: true,
				...select,
			},
			where: {
				id: presentatorId,
				appointments: {
					some: {
						appointmentId: dataServiceIds.appointmentId,
						appointment: {
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
					},
				},
			},
		});
	}

	async findOne(institutionId: string, dataServiceIds: DataServiceIds, id: string, select?: PresentatorsSelect): Promise<Partial<Presentators>> {
		return await this.prisma.presentators.findUniqueOrThrow({
			select: {
				id: true,
				...select,
			},
			where: {
				id: id,
				appointments: {
					some: {
						appointment: {
							id: dataServiceIds.appointmentId,
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
					},
				},
			},
		});
	}

	async substitute(institutionId: string, dataServiceIds: DataServiceIds, presentatorId: string, substitutionDto: UpdateSubstitutionDto): Promise<void> {
		await this.prisma.presentatorsToAppointments.update({
			data: {
				isSubstituted: substitutionDto.isSubstituted,
			},
			where: {
				presentatorId_appointmentId: {
					presentatorId: presentatorId,
					appointmentId: dataServiceIds.appointmentId,
				},
				appointment: {
					id: dataServiceIds.appointmentId,
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
				}
			}
		})
	}

	async remove(institutionId: string, dataServiceIds: DataServiceIds, presentatorId: string): Promise<void> {
		await this.prisma.appointments.update({
			data: {
				presentators: {
					disconnect: {
						presentatorId_appointmentId: {
							presentatorId: presentatorId,
							appointmentId: dataServiceIds.appointmentId,
						},
					},
				},
			},
			where: {
				id: dataServiceIds.appointmentId,
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
		});
	}
}
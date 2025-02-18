import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Presentators } from '@prisma/client';
import { CreatePresentatorDto } from './dto/create-presentator.dto';
import { UpdatePresentatorDto } from './dto/update-presentator.dto';
import { DataServiceIds } from 'src/interfaces/DataServiceIds';

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
				/*
				user: {
					connect: {
						email: createPresentatorDto.email,
					}
				},
				*/
			},
		});
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

	async update(institutionId: string, id: string, updatePresentatorDto: UpdatePresentatorDto): Promise<void> {
		await this.prisma.presentators.update({
			select: {
				id: true,
			},
			where: {
				id: id,
				institutions: {
					some: {
						id: institutionId,
					},
				},
			},
			data: {
				user: {
					connect: {
						email: updatePresentatorDto.email,
					},
				},
			},
		});
	}

	async remove(institutionId: string, id: string): Promise<void> {
		await this.prisma.presentators.delete({
			select: {
				id: true,
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
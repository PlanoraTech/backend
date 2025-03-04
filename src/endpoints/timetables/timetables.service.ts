import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { TimeTables } from '@prisma/client';
import { CreateTimeTableDto } from './dto/create-timetable.dto';
import { UpdateTimeTableDto } from './dto/update-timetable.dto';
import { AppointmentsDataService } from '@app/interfaces/DataService.interface';

const timeTablesSelect = {
	name: true,
	institutionId: false,
}

@Injectable()
export class TimeTablesService {
	constructor(private readonly prisma: PrismaService) { }

	async create(institutionId: string, createTimetableDto: CreateTimeTableDto): Promise<void> {
		await this.prisma.timeTables.create({
			select: {
				id: true,
			},
			data: {
				institutionId: institutionId,
				...createTimetableDto,
			},
		});
	}

	async findAll(institutionId: string): Promise<TimeTables[]> {
		return await this.prisma.timeTables.findMany({
			select: {
				id: true,
				...timeTablesSelect,
			},
			where: {
				institutionId: institutionId,
			},
		});
	}

	async findOne(institutionId: string, id: string): Promise<TimeTables> {
		return await this.prisma.timeTables.findUniqueOrThrow({
			select: {
				id: true,
				...timeTablesSelect,
			},
			where: {
				id: id,
				institutionId: institutionId,
			},
		});
	}

	async update(institutionId: string, id: string, updateTimetableDto: UpdateTimeTableDto): Promise<void> {
		await this.prisma.timeTables.update({
			select: {
				id: true,
			},
			data: updateTimetableDto,
			where: {
				id: id,
				institutionId: institutionId,
			},
		});
	}

	async remove(institutionId: string, id: string): Promise<void> {
		await this.prisma.$transaction([
			this.prisma.appointments.deleteMany({
				where: {
					timetables: {
						some: {
							id: id,
							institutionId: institutionId,
						},
					},
				},
			}),
			this.prisma.timeTables.delete({
				select: {
					id: true,
				},
				where: {
					id: id,
					institutionId: institutionId,
				},
			}),
		])
	}
}

@Injectable()
export class TimeTablesFromAppointmentsService {
	constructor(private readonly prisma: PrismaService) { }
	
	async add(institutionId: string, dataService: AppointmentsDataService, timetableId: string): Promise<void> {
		await this.prisma.appointments.update({
			data: {
				timetables: {
					connect: {
						id: timetableId,
						institutionId: institutionId,
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

	async findAll(institutionId: string, dataService: AppointmentsDataService): Promise<TimeTables[]> {
		return await this.prisma.timeTables.findMany({
			select: {
				id: true,
				...timeTablesSelect,
			},
			where: {
				institutionId: institutionId,
				appointments: {
					some: {
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
				},
			},
		});
	}

	async findOne(institutionId: string, dataService: AppointmentsDataService, timetableId: string): Promise<TimeTables> {
		return await this.prisma.timeTables.findUniqueOrThrow({
			select: {
				id: true,
				...timeTablesSelect,
			},
			where: {
				id: timetableId,
				institutionId: institutionId,
				appointments: {
					some: {
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
				},
			},
		});
	}

	async remove(institutionId: string, dataService: AppointmentsDataService, timetableId: string): Promise<void> {
		await this.prisma.appointments.update({
			data: {
				timetables: {
					disconnect: {
						id: timetableId,
						institutionId: institutionId,
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
					}
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
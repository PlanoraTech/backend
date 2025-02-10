import { Injectable } from '@nestjs/common';
import { CreateTimeTableDto } from './dto/create-timetable.dto';
import { UpdateTimeTableDto } from './dto/update-timetable.dto';
import { PrismaClient, TimeTables } from '@prisma/client';

interface TimeTablesSelect {
	name?: boolean,
	events?: {
		select: {
			id?: boolean,
			title?: boolean,
			date?: boolean,
		}
	},
}

@Injectable()
export class TimeTablesService {
	constructor(private readonly prisma: PrismaClient) { }

	async create(institutionsId: string, createTimetableDto: CreateTimeTableDto) {
		return await this.prisma.timeTables.create({
			select: {
				id: true,
			},
			data: {
				institutionId: institutionsId,
				...createTimetableDto,
			},
		});
	}

	async findAll(institutionsId: string, select?: TimeTablesSelect): Promise<Partial<TimeTables>[]> {
		return await this.prisma.timeTables.findMany({
			select: {
				id: true,
				...select,
			},
			where: {
				institutionId: institutionsId,
			},
		});
	}

	async findOne(institutionsId: string, id: string, select?: TimeTablesSelect): Promise<Partial<TimeTables>> {
		return await this.prisma.timeTables.findUniqueOrThrow({
			select: {
				id: true,
				...select,
			},
			where: {
				id: id,
				institutionId: institutionsId,
			},
		});
	}

	async update(institutionsId: string, id: string, updateTimetableDto: UpdateTimeTableDto): Promise<Partial<TimeTables>> {
		return await this.prisma.timeTables.update({
			select: {
				id: true,
			},
			data: updateTimetableDto,
			where: {
				id: id,
				institutionId: institutionsId,
			},
		});
	}

	async remove(institutionsId: string, id: string): Promise<void> {
		await this.prisma.$transaction([
			this.prisma.appointments.deleteMany({
				where: {
					timetables: {
						some: {
							id: id,
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
					institutionId: institutionsId,
				},
			}),
		])
	}
}
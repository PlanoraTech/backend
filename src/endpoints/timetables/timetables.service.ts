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

	async create(institutionId: string, createTimetableDto: CreateTimeTableDto) {
		return await this.prisma.timeTables.create({
			select: {
				id: true,
			},
			data: {
				institutionId: institutionId,
				...createTimetableDto,
			},
		});
	}

	async findAll(institutionId: string, select?: TimeTablesSelect): Promise<Partial<TimeTables>[]> {
		return await this.prisma.timeTables.findMany({
			select: {
				id: true,
				...select,
			},
			where: {
				institutionId: institutionId,
			},
		});
	}

	async findOne(institutionId: string, id: string, select?: TimeTablesSelect): Promise<Partial<TimeTables>> {
		return await this.prisma.timeTables.findUniqueOrThrow({
			select: {
				id: true,
				...select,
			},
			where: {
				id: id,
				institutionId: institutionId,
			},
		});
	}

	async update(institutionId: string, id: string, updateTimetableDto: UpdateTimeTableDto): Promise<Partial<TimeTables>> {
		return await this.prisma.timeTables.update({
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
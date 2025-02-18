import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TimeTables } from '@prisma/client';
import { CreateTimeTableDto } from './dto/create-timetable.dto';
import { UpdateTimeTableDto } from './dto/update-timetable.dto';

interface TimeTablesSelect {
	name?: boolean,
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
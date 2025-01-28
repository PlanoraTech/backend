import { Injectable } from '@nestjs/common';
import { CreateTimeTableDto } from './dto/create-timetable.dto';
import { UpdateTimeTableDto } from './dto/update-timetable.dto';
import { PrismaClient, TimeTables } from '@prisma/client';
import { InstitutionsService } from '../institutions/institutions.service';

abstract class AbstractTimeTablesService {
	constructor(private readonly timetablesService: InstitutionsService) { }

	create(createTimetableDto: CreateTimeTableDto): string {
		throw new Error('Method not implemented.');
	}

	async findAll(institutionsId: string, select?: {
		name?: boolean,
		events?: {
			select: {
				id?: boolean,
				title?: boolean,
				date?: boolean,
			}
		},
		appointments?: {
			select: {
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
						id?: boolean,
						name?: boolean,
					}
				},
				rooms?: {
					select: {
						id?: boolean,
						name?: boolean,
						isAvailable?: boolean,
					}
				},
				dayOfWeek?: boolean,
				start?: boolean,
				end?: boolean,
				isCancelled?: boolean,
				timetables?: boolean,
			},
		},
	}): Promise<Partial<TimeTables>[]> {
		return (await this.timetablesService.findOne(institutionsId, {
			timetables: {
				select: {
					id: true,
					...select,
				},
			},
		})).timetables;
	}

	async findOne(institutionsId: string, id: string, select?: {
		name?: boolean,
		events?: {
			select: {
				id?: boolean,
				title?: boolean,
				date?: boolean,
			}
		},
		appointments?: {
			select: {
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
						id?: boolean,
						name?: boolean,
					}
				},
				rooms?: {
					select: {
						id?: boolean,
						name?: boolean,
						isAvailable?: boolean,
					}
				},
				dayOfWeek?: boolean,
				start?: boolean,
				end?: boolean,
				isCancelled?: boolean,
				timetables?: boolean,
			},
		},
	}): Promise<any> {
		return (await this.timetablesService.findOne(institutionsId, {
			timetables: {
				select: {
					id: true,
					...select,
				},
			},
		})).timetables.find((timetable) => timetable.id === id);
	}

	update(id: string, updateTimetableDto: UpdateTimeTableDto): string {
		return `This action updates a #${id} timetable`;
	}

	remove(id: string): string {
		return `This action removes a #${id} timetable`;
	}
}

@Injectable()
export class TimeTablesService extends AbstractTimeTablesService {
	constructor() {
		super(new InstitutionsService(new PrismaClient));
	}
}
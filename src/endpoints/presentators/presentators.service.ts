import { Injectable } from '@nestjs/common';
import { CreatePresentatorDto } from './dto/create-presentator.dto';
import { UpdatePresentatorDto } from './dto/update-presentator.dto';
import { InstitutionsService } from 'src/endpoints/institutions/institutions.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PresentatorsService {
	constructor(
		//private readonly prisma: PrismaClient,
		private readonly institutionsService: InstitutionsService
	) { }
	async create(institutionsId: string, createPresentatorDto: CreatePresentatorDto) {
		/*
		return await this.prisma.presentators.create({
			data: {
				name: createPresentatorDto.name,
				institution: {
					connect: {
						id: institutionsId,
					},
				},
				user: {
					connect: {
						email: createPresentatorDto.email,
					}
				}
			},
		});
		*/
	}

	async findAll(institutionsId: string, select?: {
		name?: boolean,
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
		institution?: boolean,
	}) {
		return (await this.institutionsService.findOne(institutionsId, {
			presentators: {
				select: {
					id: true,
					...select,
				}
			},
		})).presentators;
	}

	async findOne(institutionsId: string, id: string, select?: {
		name?: boolean,
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
		institution?: boolean,
	}) {
		return (await this.institutionsService.findOne(institutionsId, {
			presentators: {
				select: {
					id: true,
					...select,
				}
			},
		})).presentators.find((presentator) => presentator.id === id);
	}

	async update(id: string, updatePresentatorDto: UpdatePresentatorDto) {
		/*
		return await this.prisma.presentators.update({
			where: {
				id: id,
			},
			data: {
				...updatePresentatorDto,
			},
		});
		*/
	}

	async remove(id: string) {
		/*
		return await this.prisma.presentators.delete({
			where: {
				id: id,
			}
		});
		*/
	}
}
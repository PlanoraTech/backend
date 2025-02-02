import { Injectable } from '@nestjs/common';
import { CreatePresentatorDto } from './dto/create-presentator.dto';
import { UpdatePresentatorDto } from './dto/update-presentator.dto';
import { Presentators, PrismaClient } from '@prisma/client';
import { ExtendedPresentators } from './types/presentators.type';

@Injectable()
export class PresentatorsService {
	constructor(private readonly prisma: PrismaClient) { }
	async create(institutionsId: string, createPresentatorDto: CreatePresentatorDto) {
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
	}

	async findAll(institutionsId: string, select?: {
		name?: boolean,
	}): Promise<Partial<Presentators>[]> {
		return await this.prisma.presentators.findMany({
			select: {
				id: true,
				...select,
			},
			where: {
				institutionId: institutionsId,
			},
		});
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
						isSubstituted?: boolean,
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
	}): Promise<Partial<ExtendedPresentators>> {
		return await this.prisma.presentators.findUniqueOrThrow({
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

	async update(institutionsId: string, id: string, updatePresentatorDto: UpdatePresentatorDto) {
		return await this.prisma.presentators.update({
			where: {
				id: id,
				institutionId: institutionsId,
			},
			data: {
				...updatePresentatorDto,
			},
		});
	}

	async remove(institutionsId: string, id: string) {
		return await this.prisma.presentators.delete({
			where: {
				id: id,
				institutionId: institutionsId,
			}
		});
	}
}
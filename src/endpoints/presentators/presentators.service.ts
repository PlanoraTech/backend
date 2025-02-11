import { Injectable } from '@nestjs/common';
import { CreatePresentatorDto } from './dto/create-presentator.dto';
import { UpdatePresentatorDto } from './dto/update-presentator.dto';
import { Presentators, PrismaClient } from '@prisma/client';

interface PresentatorsSelect {
	name?: boolean,
}

@Injectable()
export class PresentatorsService {
	constructor(private readonly prisma: PrismaClient) { }
	async create(institutionId: string, createPresentatorDto: CreatePresentatorDto) {
		return await this.prisma.presentators.create({
			data: {
				name: createPresentatorDto.name,
				institution: {
					connect: {
						id: institutionId,
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

	async findAll(institutionId: string, select?: PresentatorsSelect): Promise<Partial<Presentators>[]> {
		return await this.prisma.presentators.findMany({
			select: {
				id: true,
				...select,
			},
			where: {
				institutionId: institutionId,
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
				institutionId: institutionId,
			},
		});
	}

	async update(institutionId: string, id: string, updatePresentatorDto: UpdatePresentatorDto) {
		return await this.prisma.presentators.update({
			where: {
				id: id,
				institutionId: institutionId,
			},
			data: {
				...updatePresentatorDto,
			},
		});
	}

	async remove(institutionId: string, id: string) {
		return await this.prisma.presentators.delete({
			where: {
				id: id,
				institutionId: institutionId,
			}
		});
	}
}
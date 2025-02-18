import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Institutions } from '@prisma/client';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionsService {
	constructor(private readonly prisma: PrismaService) { }

	/*
	async create(createInstitutionDto: CreateInstitutionDto): Promise<void> {}
	*/

	async findAll(select?: {
		name?: boolean,
		type?: boolean,
		access?: boolean,
		color?: boolean,
		website?: boolean,
	}): Promise<Partial<Institutions>[]> {
		return await this.prisma.institutions.findMany({
			select: {
				id: true,
				...select,
			},
		});
	}

	async findOne(id: string, select?: {
		name?: boolean,
		type?: boolean,
		color?: boolean,
		website?: boolean,
	}): Promise<Partial<Institutions>> {
		return await this.prisma.institutions.findUniqueOrThrow({
			select: {
				id: true,
				access: true,
				...select,
			},
			where: {
				id,
			},
		});
	}

	async update(id: string, updateInstitutionDto: UpdateInstitutionDto): Promise<void> {
		await this.prisma.institutions.update({
			select: {
				id: true,
			},
			data: {
				...updateInstitutionDto,
			},
			where: {
				id,
			},
		});
	}

	/*
	async remove(id: string): Promise<void> {}
	*/
}
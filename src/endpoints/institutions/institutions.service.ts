import { Injectable } from '@nestjs/common';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { AccessType, Institutions, PrismaClient } from '@prisma/client';

@Injectable()
export class InstitutionsService {
	private static readonly prisma: PrismaClient = new PrismaClient();
	constructor(private readonly prisma: PrismaClient) { }

	static async getInstitutionAccessById(id: string): Promise<AccessType> {
		return (await this.prisma.institutions.findUniqueOrThrow({
			select: {
				access: true,
			},
			where: {
				id,
			},
		})).access;
	}

	/*
	async create(createInstitutionDto: CreateInstitutionDto) {}
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

	async update(id: string, updateInstitutionDto: UpdateInstitutionDto) {
		return await this.prisma.institutions.update({
			select: {
				name: true,
				type: true,
				access: true,
				color: true,
				website: true,
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
	async remove(id: string) {}
	*/
}
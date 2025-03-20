import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Institutions } from '@prisma/client';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

const institutionsSelect = {
	name: true,
	type: true,
	access: true,
	color: true,
	website: true,
};

@Injectable()
export class InstitutionsService {
	constructor(private readonly prisma: PrismaService) { }

	async findAll(): Promise<Institutions[]> {
		return await this.prisma.institutions.findMany({
			select: {
				id: true,
				...institutionsSelect,
			},
		});
	}

	async findOne(id: string): Promise<Institutions> {
		return await this.prisma.institutions.findUniqueOrThrow({
			select: {
				id: true,
				...institutionsSelect,
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
}
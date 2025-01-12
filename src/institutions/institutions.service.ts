import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class InstitutionsService {
	constructor(private prisma: PrismaClient) { }
	create(createInstitutionDto: CreateInstitutionDto) {
		return 'This action adds a new institution';
	}

	async findAll() {
		return this.prisma.institutions.findMany({
			select: {
				id: true,
				name: true,
				type: true,
			},
		});
	}

	async findOne(id: string, select?: {
		name?: boolean,
		type?: boolean,
		access?: boolean,
		color?: boolean,
		website?: boolean,
		groups?: boolean,
		presentators?: {
			select: {
				id?: boolean,
				name?: boolean,
				appointments?: boolean,
				institution?: boolean,
			},
		},
		subjects?: boolean,
		rooms?: boolean,
		timetables?: {
			select: {
				id?: boolean,
				group?: boolean,
				appointments?: boolean,
				institution?: boolean,
			},
		},
		users?: boolean,
	}) {
		let institution = await this.prisma.institutions.findUniqueOrThrow({
			select: {
				id: true,
				access: true,
				...select,
			},
			where: {
				id,
			},
		});
		if (institution.access != "PRIVATE") {
			return institution;
		}
		else {
			throw new ForbiddenException("You do not have access to this institution");
		}
	}

	update(id: string, updateInstitutionDto: UpdateInstitutionDto) {
		return `This action updates a #${id} institution`;
	}

	remove(id: string) {
		return `This action removes a #${id} institution`;
	}
}

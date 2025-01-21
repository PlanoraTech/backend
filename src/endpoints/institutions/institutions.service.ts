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

	async findAll(select?: {
		name?: boolean,
		type?: boolean,
		access?: boolean,
		color?: boolean,
		website?: boolean,
		groups?: {
			select: {
				id?: boolean,
				name?: boolean,
				timetables?: {
					select: {
						id?: boolean,
						name?: boolean,
						groups?: boolean,
						appointments?: {
							select: {
								id?: boolean,
								subject?: boolean,
								presentators?: boolean,
								rooms?: boolean,
								dayOfWeek?: boolean,
								start?: boolean,
								end?: boolean,
								isCancelled?: boolean,
								timetables?: boolean,
							},
						},
						institution?: boolean,
					},
				},
				institution?: boolean,
			},
		},
		presentators?: {
			select: {
				id?: boolean,
				name?: boolean,
				appointments?: boolean,
				institution?: boolean,
			},
		},
		subjects?: {
			select: {
				id?: boolean,
				name?: boolean,
				subjectId?: boolean,
				appointments?: boolean,
				institution?: boolean
			},
		},
		rooms?: {
			select: {
				id?: boolean,
				name?: boolean,
				isAvailable?: boolean,
				appointments?: boolean,
				institution?: boolean,
			},
		},
		timetables?: {
			select: {
				id?: boolean,
				name?: boolean,
				groups?: boolean,
				appointments?: {
					select: {
						id?: boolean,
						subject?: boolean,
						presentators?: boolean,
						rooms?: boolean,
						dayOfWeek?: boolean,
						start?: boolean,
						end?: boolean,
						isCancelled?: boolean,
						timetables?: boolean,
					},
				},
				institution?: boolean,
			},
		},
		users?: {
			select: {
				id?: boolean,
				email?: boolean,
				role?: boolean,
				appointments?: boolean,
				institution?: boolean
			},
		},
	}) {
		return this.prisma.institutions.findMany({
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
		groups?: {
			select: {
				id?: boolean,
				name?: boolean,
				timetables?: {
					select: {
						id?: boolean,
						name?: boolean,
						groups?: boolean,
						appointments?: {
							select: {
								id?: boolean,
								subject?: boolean,
								presentators?: boolean,
								rooms?: boolean,
								dayOfWeek?: boolean,
								start?: boolean,
								end?: boolean,
								isCancelled?: boolean,
								timetables?: boolean,
							},
						},
						institution?: boolean,
					},
				},
				institution?: boolean,
			},
		},
		presentators?: {
			select: {
				id?: boolean,
				name?: boolean,
				appointments?: boolean,
				institution?: boolean,
			},
		},
		subjects?: {
			select: {
				id?: boolean,
				name?: boolean,
				subjectId?: boolean,
				appointments?: boolean,
				institution?: boolean
			},
		},
		rooms?: {
			select: {
				id?: boolean,
				name?: boolean,
				isAvailable?: boolean,
				appointments?: boolean,
				institution?: boolean,
			},
		},
		timetables?: {
			select: {
				id?: boolean,
				name?: boolean,
				groups?: boolean,
				appointments?: {
					select: {
						id?: boolean,
						subject?: boolean,
						presentators?: boolean,
						rooms?: boolean,
						dayOfWeek?: boolean,
						start?: boolean,
						end?: boolean,
						isCancelled?: boolean,
						timetables?: boolean,
					},
				},
				institution?: boolean,
			},
		},
		users?: {
			select: {
				id?: boolean,
				email?: boolean,
				role?: boolean,
				appointments?: boolean,
				institution?: boolean
			},
		},
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
			throw new ForbiddenException("You have to log in to see this institution");
		}
	}

	update(id: string, updateInstitutionDto: UpdateInstitutionDto) {
		return `This action updates a #${id} institution`;
	}

	remove(id: string) {
		return `This action removes a #${id} institution`;
	}
}

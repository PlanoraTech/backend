import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { PrismaClient } from '@prisma/client';
import { ExtendedInstitutions } from './types/institutions.type';

@Injectable()
export class InstitutionsService {
	constructor(private readonly prisma: PrismaClient) { }
	async create(createInstitutionDto: CreateInstitutionDto) {
		
	}

	async findAll(select?: {
		name?: boolean,
		type?: boolean,
		access?: boolean,
		color?: boolean,
		website?: boolean,
		presentators?: {
			select: {
				id?: boolean,
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
			},
		},
		subjects?: {
			select: {
				id?: boolean,
				name?: boolean,
				subjectId?: boolean,
				appointments?: boolean,
			},
		},
		rooms?: {
			select: {
				id?: boolean,
				name?: boolean,
				isAvailable?: boolean,
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
			},
		},
		timetables?: {
			select: {
				id?: boolean,
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
			},
		},
		users?: {
			select: {
				id?: boolean,
				email?: boolean,
				role?: boolean,
				appointments?: boolean,
			},
		},
	}): Promise<Partial<ExtendedInstitutions>[]> {
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
		presentators?: {
			select: {
				id?: boolean,
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
			},
		},
		subjects?: {
			select: {
				id?: boolean,
				name?: boolean,
				subjectId?: boolean,
				appointments?: boolean,
			},
		},
		rooms?: {
			select: {
				id?: boolean,
				name?: boolean,
				isAvailable?: boolean,
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
			},
		},
		timetables?: {
			select: {
				id?: boolean,
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
			},
		},
		users?: {
			select: {
				id?: boolean,
				email?: boolean,
				role?: boolean,
				appointments?: boolean,
			},
		},
	}): Promise<Partial<ExtendedInstitutions>> {
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
		switch (institution.access) {
			case "PRIVATE":
				throw new ForbiddenException("You have to log in to see this institution");
			case "PUBLIC":
				return institution;
		}
	}

	update(id: string, updateInstitutionDto: UpdateInstitutionDto) {
		return `This action updates a #${id} institution`;
	}

	remove(id: string) {
		return `This action removes a #${id} institution`;
	}
}
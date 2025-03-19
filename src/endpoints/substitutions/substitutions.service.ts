import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';

@Injectable()
export class SubstitutionsService {
	constructor(private readonly prismaService: PrismaService) { }

	async findAll(institutionId: string, presentatorId: string) {
		return await this.prismaService.substitutions.findMany({
			where: {
				presentators: {
					some: {
						id: presentatorId,
						institutions: {
							some: {
								id: institutionId,
							},
						},
					},
				},
			},
		});
	}

	async findOne(institutionId: string, presentatorId: string, id: string) {
		return await this.prismaService.substitutions.findUniqueOrThrow({
			where: {
				id: id,
				presentators: {
					some: {
						id: presentatorId,
						institutions: {
							some: {
								id: institutionId,
							},
						},
					},
				},
			},
		});
	}
}

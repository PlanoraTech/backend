import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PrismaClient, Subjects } from '@prisma/client';

interface SubjectsSelect {
	name?: boolean,
	subjectId?: boolean,
}

@Injectable()
export class SubjectsService {
	constructor(private readonly prisma: PrismaClient) { }
	async create(institutionsId: string, createSubjectDto: CreateSubjectDto) {
		return await this.prisma.subjects.create({
			data: {
				...createSubjectDto,
				institutionId: institutionsId,
			},
		});
	}

	async findAll(institutionsId: string, select?: SubjectsSelect): Promise<Partial<Subjects>[]> {
		return await this.prisma.subjects.findMany({
			select: {
				id: true,
				...select,
			},
			where: {
				institutionId: institutionsId,
			},
		});
	}

	async findOne(institutionsId: string, id: string, select?: SubjectsSelect): Promise<Partial<Subjects>> {
		return await this.prisma.subjects.findUniqueOrThrow({
			select: {
				id: true,
				...select,
			},
			where: {
				id,
				institutionId: institutionsId,
			},
		});
	}

	async update(institutionsId: string, id: string, updateSubjectDto: UpdateSubjectDto) {
		return await this.prisma.subjects.update({
			select: {
				name: true,
			},
			data: {
				...updateSubjectDto,
			},
			where: {
				id,
				institutionId: institutionsId,
			},
		});
	}

	async remove(institutionsId: string, id: string) {
		return await this.prisma.subjects.delete({
			where: {
				id,
				institutionId: institutionsId,
			},
		});
	}
}
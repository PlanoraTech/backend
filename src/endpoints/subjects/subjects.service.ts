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
	async create(institutionId: string, createSubjectDto: CreateSubjectDto) {
		return await this.prisma.subjects.create({
			data: {
				...createSubjectDto,
				institutionId: institutionId,
			},
		});
	}

	async findAll(institutionId: string, select?: SubjectsSelect): Promise<Partial<Subjects>[]> {
		return await this.prisma.subjects.findMany({
			select: {
				id: true,
				...select,
			},
			where: {
				institutionId: institutionId,
			},
		});
	}

	async findOne(institutionId: string, id: string, select?: SubjectsSelect): Promise<Partial<Subjects>> {
		return await this.prisma.subjects.findUniqueOrThrow({
			select: {
				id: true,
				...select,
			},
			where: {
				id,
				institutionId: institutionId,
			},
		});
	}

	async update(institutionId: string, id: string, updateSubjectDto: UpdateSubjectDto) {
		return await this.prisma.subjects.update({
			select: {
				name: true,
			},
			data: {
				...updateSubjectDto,
			},
			where: {
				id,
				institutionId: institutionId,
			},
		});
	}

	async remove(institutionId: string, id: string) {
		return await this.prisma.subjects.delete({
			where: {
				id,
				institutionId: institutionId,
			},
		});
	}
}
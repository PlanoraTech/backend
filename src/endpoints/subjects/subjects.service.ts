import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Subjects } from '@prisma/client';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

const subjectsSelect = {
    name: true,
    subjectId: true,
    institutionId: false,
};

@Injectable()
export class SubjectsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        institutionId: string,
        createSubjectDto: CreateSubjectDto,
    ): Promise<void> {
        await this.prisma.subjects.create({
            select: {
                id: true,
            },
            data: {
                ...createSubjectDto,
                institutionId: institutionId,
            },
        });
    }

    async findAll(institutionId: string): Promise<Subjects[]> {
        return await this.prisma.subjects.findMany({
            select: {
                id: true,
                ...subjectsSelect,
            },
            where: {
                institutionId: institutionId,
            },
        });
    }

    async findOne(institutionId: string, id: string): Promise<Subjects> {
        return await this.prisma.subjects.findUniqueOrThrow({
            select: {
                id: true,
                ...subjectsSelect,
            },
            where: {
                id,
                institutionId: institutionId,
            },
        });
    }

    async update(
        institutionId: string,
        id: string,
        updateSubjectDto: UpdateSubjectDto,
    ): Promise<void> {
        await this.prisma.subjects.update({
            select: {
                id: true,
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

    async remove(institutionId: string, id: string): Promise<void> {
        await this.prisma.subjects.delete({
            select: {
                id: true,
            },
            where: {
                id,
                institutionId: institutionId,
            },
        });
    }
}

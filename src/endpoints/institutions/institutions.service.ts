import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

export const institutionsSelect: Prisma.InstitutionsSelect = {
    id: true,
    name: true,
    type: true,
    access: true,
    color: true,
    website: true,
};

@Injectable()
export class InstitutionsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<
        Prisma.InstitutionsGetPayload<{
            select: typeof institutionsSelect;
        }>[]
    > {
        return await this.prisma.institutions.findMany({
            select: {
                ...institutionsSelect,
            },
        });
    }

    async findOne(id: string): Promise<
        Prisma.InstitutionsGetPayload<{
            select: typeof institutionsSelect;
        }>
    > {
        return await this.prisma.institutions.findUniqueOrThrow({
            select: {
                ...institutionsSelect,
            },
            where: {
                id,
            },
        });
    }

    async update(
        id: string,
        updateInstitutionDto: UpdateInstitutionDto,
    ): Promise<void> {
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

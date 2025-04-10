import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Substitutions } from '@prisma/client';

const substitutionsSelect = {
    from: true,
    to: true,
    presentatorId: false,
};

@Injectable()
export class SubstitutionsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(
        institutionId: string,
        presentatorId: string,
    ): Promise<Substitutions[]> {
        return await this.prisma.substitutions.findMany({
            select: {
                id: true,
                ...substitutionsSelect,
            },
            where: {
                presentator: {
                    id: presentatorId,
                    institutions: {
                        some: {
                            id: institutionId,
                        },
                    },
                },
            },
        });
    }

    async findOne(
        institutionId: string,
        presentatorId: string,
        id: string,
    ): Promise<Substitutions> {
        return await this.prisma.substitutions.findUniqueOrThrow({
            select: {
                id: true,
                ...substitutionsSelect,
            },
            where: {
                id: id,
                presentator: {
                    id: presentatorId,
                    institutions: {
                        some: {
                            id: institutionId,
                        },
                    },
                },
            },
        });
    }
}

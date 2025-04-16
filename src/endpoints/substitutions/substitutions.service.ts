import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Prisma } from '@prisma/client';

export const substitutionsSelect: Prisma.SubstitutionsSelect = {
    id: true,
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
    ): Promise<
        Prisma.SubstitutionsGetPayload<{
            select: typeof substitutionsSelect;
        }>[]
    > {
        return await this.prisma.substitutions.findMany({
            select: {
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
    ): Promise<
        Prisma.SubstitutionsGetPayload<{
            select: typeof substitutionsSelect;
        }>
    > {
        return await this.prisma.substitutions.findUniqueOrThrow({
            select: {
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

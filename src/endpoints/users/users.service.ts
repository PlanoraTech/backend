import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserDto } from './dto/user.dto';

export const usersSelect: Prisma.UsersSelect = {
    id: true,
    email: true,
};

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async add(institutionId: string, userDto: UserDto): Promise<void> {
        await this.prisma.usersToInstitutions.create({
            select: {
                institutionId: true,
            },
            data: {
                user: {
                    connect: {
                        email: userDto.email,
                    },
                },
                institution: {
                    connect: {
                        id: institutionId,
                    },
                },
            },
        });
    }

    async findAll(institutionId: string): Promise<
        Prisma.UsersGetPayload<{
            select: typeof usersSelect;
        }>[]
    > {
        return await this.prisma.users.findMany({
            select: {
                ...usersSelect,
            },
            where: {
                institutions: {
                    some: {
                        institutionId: institutionId,
                    },
                },
            },
        });
    }

    async remove(institutionId: string, id: string): Promise<void> {
        await this.prisma.usersToInstitutions.delete({
            select: {
                institutionId: true,
            },
            where: {
                userId_institutionId: {
                    userId: id,
                    institutionId: institutionId,
                },
                institution: {
                    id: institutionId,
                },
            },
        });
    }
}

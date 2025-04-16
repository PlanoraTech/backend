import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SecretService } from '@app/auth/secret/secret.service';

export const profileSelect: Prisma.UsersSelect = {
    email: true,
    institutions: {
        select: {
            institution: {
                select: {
                    name: true,
                },
            },
            role: true,
        },
    },
};

@Injectable()
export class ProfileService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly secretService: SecretService,
    ) {}

    async get(id: string): Promise<
        Prisma.UsersGetPayload<{
            select: typeof profileSelect;
        }>
    > {
        return await this.prisma.users.findUniqueOrThrow({
            select: {
                ...profileSelect,
            },
            where: {
                id: id,
            },
        });
    }

    async updatePassword(
        id: string,
        updateProfileDto: UpdateProfileDto,
    ): Promise<void> {
        await this.prisma.users.update({
            select: {
                id: true,
            },
            data: {
                password: await this.secretService.encryptPassword(
                    updateProfileDto.newPassword,
                ),
            },
            where: {
                id: id,
            },
        });
    }

    async remove(id: string): Promise<void> {
        await this.prisma.users.delete({
            select: {
                id: true,
            },
            where: {
                id: id,
            },
        });
    }
}

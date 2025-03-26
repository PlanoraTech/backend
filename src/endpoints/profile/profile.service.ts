import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Users } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SecretService } from '@app/auth/secret/secret.service';

@Injectable()
export class ProfileService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly secretService: SecretService,
    ) {}

    async get(id: string): Promise<Partial<Users>> {
        return await this.prisma.users.findUniqueOrThrow({
            select: {
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

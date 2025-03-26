import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Users } from '@prisma/client';
import { UserDto } from './dto/user.dto';

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

    async findAll(institutionId: string): Promise<Partial<Users>[]> {
        return await this.prisma.users.findMany({
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

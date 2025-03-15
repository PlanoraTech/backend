import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { AccessType } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@app/interfaces/User.interface';

export enum TokenExpiry {
    DAY = 1000 * 60 * 60 * 24,
    MONTH = 1000 * 60 * 60 * 24 * 30,
    NEVER = 1000 * 60 * 60 * 24 * 365 * 100,
}

@Injectable()
export class SecretService {
    constructor(private readonly prisma: PrismaService) { };
    private generateToken(): string {
        return crypto.randomUUID();
    }
    async encryptPassword(password: string, saltRounds: number = 10): Promise<string> {
        return await hash(password, saltRounds);
    }
    async comparePassword(givenPassword: string, hash: string): Promise<boolean> {
        return await compare(givenPassword, hash);
    }
    async createToken(userId: string, tokenExpiry: TokenExpiry = TokenExpiry.DAY): Promise<{ token: string, expiry: Date }> {
        return await this.prisma.tokens.create({
            select: {
                token: true,
                expiry: true,
            },
            data: {
                token: this.generateToken(),
                expiry: new Date(Date.now() + tokenExpiry),
                user: {
                    connect: {
                        id: userId,
                    }
                }
            }
        }).catch((e) => {
            if (e instanceof PrismaClientKnownRequestError) {
                switch (e.code) {
                    case "P2002":
                        return this.createToken(userId, tokenExpiry);
                }
            }
            throw e;
        });
    }
    async getActiveToken(userId: string): Promise<{ token: string, expiry: Date } | null> {
        return await this.prisma.tokens.findFirstOrThrow({
            select: {
                token: true,
                expiry: true,
            },
            where: {
                userId: userId,
                expiry: {
                    gt: new Date(),
                },
            }
        }).catch((e) => {
            if (e instanceof PrismaClientKnownRequestError) {
                switch (e.code) {
                    case 'P2025':
                        return null;
                }
            }
            throw e;
        })
    }
    async seamlessAuth(token: string): Promise<User> {
        let query: { user: User } = await this.prisma.tokens.findUniqueOrThrow({
            select: {
                user: {
                    select: {
                        id: true,
                        institutions: {
                            select: {
                                institutionId: true,
                                role: true,
                                presentatorId: true,
                            },
                        }
                    }
                }
            },
            where: {
                token: token,
                expiry: {
                    gt: new Date(),
                },
            }
        }).catch(() => {
            throw new UnauthorizedException("Invalid token");
        });
        return {
            id: query.user.id,
            institutions: query.user.institutions,
        }
    }

    async getUserIdByEmail(email: string): Promise<string> {
        return (await this.prisma.users.findUniqueOrThrow({
            select: {
                id: true,
            },
            where: {
                email: email,
            }
        })).id;
    }

    async getInstitutionAccessById(id: string): Promise<AccessType> {
        return (await this.prisma.institutions.findUniqueOrThrow({
            select: {
                access: true,
            },
            where: {
                id,
            },
        })).access;
    }
}
import { Injectable, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { AccessType, Roles, Tokens, Users } from '@prisma/client';
import { compare, hash } from 'bcrypt';

export enum TokenExpiry {
    DAY = 1000 * 60 * 60 * 24,
    MONTH = 1000 * 60 * 60 * 24 * 30,
    NEVER = 1000 * 60 * 60 * 24 * 365 * 100,
}

@Injectable()
export class SecretService {
    private static readonly prisma: PrismaService = new PrismaService();
    private static generateToken(): string {
        return crypto.randomUUID();
    }
    static async encryptPassword(password: string, saltRounds: number = 10): Promise<string> {
        return await hash(password, saltRounds);
    }
    static async comparePassword(givenPassword: string, hash: string): Promise<boolean> {
        return await compare(givenPassword, hash);
    }
    static async createToken(userId: string, tokenExpiry: TokenExpiry = TokenExpiry.DAY): Promise<Partial<Tokens>> {
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
        }).catch((error) => {
            switch (error.code) {
                case "P2002":
                    return this.createToken(userId, tokenExpiry);
                default:
                    throw new InternalServerErrorException;
            }
        });
    }
    static async getActiveToken(userId: string): Promise<Partial<Tokens>> {
        return await this.prisma.tokens.findFirst({
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
        })
    }
    static async seamlessAuth(token: string): Promise<boolean> {
        await this.prisma.tokens.findUniqueOrThrow({
            select: {
                expiry: true,
            },
            where: {
                token: token,
                expiry: {
                    gt: new Date(),
                },
            }
        }).catch(() => {
            throw new NotFoundException("Invalid token");
        })
        return true;
    }
    static async getUserIdByToken(token: string): Promise<string> {
        return (await this.prisma.tokens.findUniqueOrThrow({
            select: {
                userId: true,
            },
            where: {
                token: token,
            }
        })).userId;
    }
    
    static async getUserIdByEmail(email: string): Promise<Partial<Users>> {
        return await this.prisma.users.findUniqueOrThrow({
            select: {
                id: true,
            },
            where: {
                email: email,
            }
        });
    }

    static async getIfPresentatorIsAssignedToAUserByToken(token: string, institutionId: string): Promise<boolean>
    {
        await this.prisma.users.findFirstOrThrow({
            where: {
                institutions: {
                    some: {
                        institutionId: institutionId,
                        presentator: {},
                    }
                },
                tokens: {
                    some: {
                        token: token,
                    }
                }
            }
        })
        return true;
    }

    static async getIfInstitutionIsAssignedToAUserByToken(token: string, institutionId: string): Promise<boolean> {
        await this.prisma.users.findFirstOrThrow({
            select: {
                institutions: {
                    select: {
                        institutionId: true,
                    },
                },
            },
            where: {
                institutions: {
                    some: {
                        institutionId: institutionId,
                    },
                },
                tokens: {
                    some: {
                        token: token,
                    },
                },
            },
        }).catch(() => {
            throw new ForbiddenException("You do not have permission to access this information");
        });
        return true;
    }

    static async getIfRoleWithInstitutionIsAssignedToAUserByToken(token: string, institutionId: string, roles: Roles[]): Promise<boolean> {
        await this.prisma.users.findFirstOrThrow({
            select: {
                institutions: {
                    select: {
                        role: true,
                    }
                }
            },
            where: {
                institutions: {
                    some: {
                        institutionId: institutionId,
                        OR: roles.map((role) => {
                            return {
                                role: role,
                            }
                        }),
                    }
                },
                tokens: {
                    some: {
                        token: token,
                    },
                },
            },
        }).catch(() => {
            throw new ForbiddenException("You do not have permission to access this information");
        });
        return true;
    }

    static async getInstitutionAccessById(id: string): Promise<AccessType> {
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
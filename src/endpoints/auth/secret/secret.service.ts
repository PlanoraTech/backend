import { Injectable, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { AccessType, Roles } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
    static async createToken(userId: string, tokenExpiry: TokenExpiry = TokenExpiry.DAY): Promise<{token: string, expiry: Date}> {
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
    static async getActiveToken(userId: string): Promise<{token: string, expiry: Date} | null> {
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
                OR: [
                    {
                        user: {
                            isNot: null,
                        },
                    },
                    {
                        admin: {
                            isNot: null,
                        },
                    },
                ],
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
        let user = await this.prisma.tokens.findUniqueOrThrow({
            select: {
                userId: true,
            },
            where: {
                NOT: {
                    userId: null,
                    user: null,
                },
                token: token,
            }
        });
        if (user.userId)
        {
            return user.userId;
        }
        throw new NotFoundException('Invalid token');
    }
    
    static async getUserIdByEmail(email: string): Promise<string> {
        return (await this.prisma.users.findUniqueOrThrow({
            select: {
                id: true,
            },
            where: {
                email: email,
            }
        })).id;
    }

    static async getIfUserHasPresentatorPermissionByToken(token: string, institutionId: string, substitutePresentatorId: string): Promise<boolean>
    {
        await this.prisma.users.findFirstOrThrow({
            where: {
                institutions: {
                    some: {
                        institutionId: institutionId,
                        presentatorId: substitutePresentatorId,
                    }
                },
                tokens: {
                    some: {
                        token: token,
                    }
                }
            }
        }).catch((e) => {
            if (e instanceof PrismaClientKnownRequestError)
            {
                switch (e.code)
                {
                    case 'P2025':
                        throw new ForbiddenException("You do not have permission to modify this information");
                }
            }
            throw e;
        });
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
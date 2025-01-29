import { Injectable } from '@nestjs/common';
import { PrismaClient, Tokens } from '@prisma/client';
import { compare, hash } from 'bcrypt';

@Injectable()
export class SecretService {
    private static readonly prisma: PrismaClient = new PrismaClient();
    private static generateToken(): string {
        return crypto.randomUUID();
    }
    static async encryptPassword(password: string, saltRounds: number = 10): Promise<string> {
        return await hash(password, saltRounds);
    }
    static async comparePassword(givenPassword: string, hash: string): Promise<boolean> {
        return await compare(givenPassword, hash);
    }
    static async createToken(userId: string): Promise<Partial<Tokens>> {
        return await this.prisma.tokens.create({
            select: {
                token: true,
                expiry: true,
            },
            data: {
                token: SecretService.generateToken(),
                expiry: new Date(Date.now() + 1000 * 60 * 60 * 24),
                user: {
                    connect: {
                        id: userId,
                    }
                }
            }
        });
    }
    static async getActiveToken(userId: string): Promise<Partial<Tokens>> {
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
        });
    }
    static async seamlessAuth(token: string): Promise<boolean>
    {
        await this.prisma.tokens.findFirstOrThrow({
            select: {
                expiry: true,
            },
            where: {
                token: token,
                expiry: {
                    gt: new Date(),
                },
            }
        }) 
        return true;
    }
}

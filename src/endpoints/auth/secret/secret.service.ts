import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { compare, hash } from 'bcrypt';

@Injectable()
export class SecretService {
    private static readonly prisma: PrismaClient;
    static generateToken(): string {
        return crypto.randomUUID();
    }
    static async hashPassword(password: string, saltRounds: number = 10): Promise<string> {
        return await hash(password, saltRounds);
    }
    static async decryptPassword(givenPassword: string, hash: string): Promise<boolean> {
        return await compare(givenPassword, hash);
    }
    static async verifyToken(token: string) {
        return await this.prisma.tokens.findFirstOrThrow({
            select: {
                expiry: true,
            },
            where: {
                token: token,
                expiry: {
                    gt: new Date(),
                },
            }
        });
    }
}

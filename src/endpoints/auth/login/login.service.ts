import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SecretService } from '../secret/secret.service';
import { ExtendedLogin } from './types/login.type';

@Injectable()
export class LoginService {
  constructor(private readonly prisma: PrismaClient) { }
  async loginByToken(token: string): Promise<Partial<ExtendedLogin>> {
    return await this.prisma.tokens.findFirstOrThrow({
      select: {
        user: {
          select: {
            role: true,
          }
        },
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

  async loginByEmailAndPassword(email: string, password: string): Promise<Partial<ExtendedLogin>> {
    let user = await this.prisma.users.findUniqueOrThrow({
      select: {
        id: true,
        password: true,
      },
      where: {
        email: email,
      },
    });
    switch (await SecretService.comparePassword(password, user.password)) {
      case true:
        return await SecretService.getActiveToken(user.id) ?? await SecretService.createToken(user.id);
      case false:
        throw new NotFoundException;
    };
  }
}

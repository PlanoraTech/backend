import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SecretService } from '../secret/secret.service';

@Injectable()
export class LoginService {
  constructor(private readonly prisma: PrismaClient) { }
  async loginByToken(token: string) {
    return await this.prisma.tokens.findFirstOrThrow({
      select: {
        user: {
          select: {
            id: true,
            email: true,
          },
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

  async loginByEmailAndPassword(email: string, password: string) {
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

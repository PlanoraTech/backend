import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaClient } from '@prisma/client';
import { SecretService } from '../secret/secret.service';

@Injectable()
export class RegisterService {
  constructor(private readonly prisma: PrismaClient) {}
  async create(registerDto: RegisterDto) {
    let user = await this.prisma.users.create({
      select: {
        id: true,
      },
      data: {
        email: registerDto.email,
        password: await SecretService.hashPassword(registerDto.password),
      }
    });
    return await this.prisma.tokens.create({
      select: {
        token: true,
      },
      data: {
        token: SecretService.generateToken(),
        expiry: new Date(Date.now() + 1000 * 60 * 60 * 24),
        user: {
          connect: {
            id: user.id
          }
        }
      }
    });
  }
}

import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaClient, Users } from '@prisma/client';
import { SecretService } from '../auth/secret/secret.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaClient) { }

  async get(token: string): Promise<Partial<Users>> {
    return await this.prisma.users.findFirstOrThrow({
      select: {
        email: true,
        role: true,
      },
      where: {
        tokens: {
          some: {
            token: token,
          },
        },
      },
    });
  }

  async updatePassword(token: string, updateProfileDto: UpdateProfileDto): Promise<boolean> {
    let userId = await SecretService.getUserIdByToken(token);
    await this.prisma.users.update({
      select: {
        id: true,
      },
      data: {
        password: await SecretService.encryptPassword(updateProfileDto.newPassword),
      },
      where: {
        id: userId,
      },
    });
    return true;
  }

  async remove(token: string): Promise<boolean> {
    let userId = await SecretService.getUserIdByToken(token);
    await this.prisma.users.delete({
      select: {
        id: true,
      },
      where: {
        id: userId,
      },
    });
    return true;
  }
}

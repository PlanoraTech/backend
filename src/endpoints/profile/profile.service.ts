import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaClient, Users } from '@prisma/client';
import { SecretService } from '../auth/secret/secret.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaClient) { }

  async get(token: string): Promise<Partial<Users>> {
    let userId = await SecretService.getUserIdByToken(token);
    return await this.prisma.users.findUniqueOrThrow({
      select: {
        email: true,
        role: true,
      },
      where: {
        id: userId,
      },
    });
  }

  async updatePassword(token: string, updateProfileDto: UpdateProfileDto): Promise<void> {
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
  }

  async remove(token: string): Promise<void> {
    let userId = await SecretService.getUserIdByToken(token);
    await this.prisma.users.delete({
      select: {
        id: true,
      },
      where: {
        id: userId,
      },
    });
  }
}

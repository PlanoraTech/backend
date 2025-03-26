import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PrismaService } from '@app/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    id: string,
    createNotificationDto: CreateNotificationDto,
  ): Promise<void> {
    await this.prisma.notificationTokens.create({
      select: {
        id: true,
      },
      data: {
        user: {
          connect: {
            id: id,
          },
        },
        token: createNotificationDto.expoPushToken,
      },
    });
  }
}

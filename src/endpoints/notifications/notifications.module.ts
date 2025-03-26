import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService],
})
export class NotificationsModule {}

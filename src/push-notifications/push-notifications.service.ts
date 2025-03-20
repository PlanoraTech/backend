import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '@app/prisma/prisma.service';
import { Notification } from './interfaces/Notification.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PushNotificationsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
    ) { }

    async sendNotificationToPushServer(tokens: { token: string }[], notification: Notification) {
        return await firstValueFrom(this.httpService.post("https://exp.host/--/api/v2/push/send", {
            to: tokens.map((token) => `ExponentPushToken[${token.token}]`),
            title: notification.title,
            body: notification.body,
        }));
    }

    async getPushNotificationTokens(): Promise<{ token: string }[]> {
        return await this.prisma.notificationTokens.findMany({
            select: {
                token: true,
            }
        });
    }
}
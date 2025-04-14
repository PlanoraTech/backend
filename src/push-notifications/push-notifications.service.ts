import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '@app/prisma/prisma.service';
import { Notification } from './interfaces/notification';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

interface Receipt {
    id: string;
    status: string;
    message: string;
    details: {
        error: string;
        expoPushToken: string;
    };
}

@Injectable()
export class PushNotificationsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
    ) {}

    private async deleteToken(token: string): Promise<void> {
        await this.prisma.notificationTokens
            .delete({
                select: {
                    id: true,
                },
                where: {
                    token: token,
                },
            })
            .catch((e) => {
                if (e instanceof PrismaClientKnownRequestError) {
                    switch (e.code) {
                        case 'P2025':
                            Logger.error(
                                `Token ${token} not found in database`,
                                PushNotificationsService.name,
                            );
                    }
                }
                Logger.error(e, PushNotificationsService.name);
            });
    }

    async sendNotificationToPushServer(
        tokens: { token: string }[],
        notification: Notification,
    ): Promise<void> {
        const response: AxiosResponse<{
            data: Receipt[];
        }> = await firstValueFrom(
            this.httpService.post('https://exp.host/--/api/v2/push/send', {
                to: tokens.map((token) => `ExponentPushToken[${token.token}]`),
                title: notification.title,
                body: notification.body,
            }),
        );

        response.data.data.forEach(async (receipt: Receipt) => {
            switch (receipt.status) {
                case 'ok':
                    Logger.log(
                        `Notification sent to ${receipt.id}`,
                        PushNotificationsService.name,
                    );
                    break;
                case 'error':
                    switch (receipt.details.error) {
                        case 'DeviceNotRegistered':
                            const token: string = receipt.details.expoPushToken
                                .replace('ExponentPushToken[', '')
                                .replace(']', '');
                            Logger.warn(
                                `Device with token '${token}' is not registered anymore. Deleting token...`,
                                PushNotificationsService.name,
                            );
                            this.deleteToken(token);
                            break;
                        default:
                            Logger.error(
                                receipt.message,
                                PushNotificationsService.name,
                            );
                            break;
                    }
            }
        });
    }

    async getPushNotificationTokens(): Promise<{ token: string }[]> {
        return await this.prisma.notificationTokens.findMany({
            select: {
                token: true,
            },
        });
    }
}

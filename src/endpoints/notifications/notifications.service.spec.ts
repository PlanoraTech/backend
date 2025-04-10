import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

describe('NotificationsService', () => {
    let service: NotificationsService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [NotificationsService, PrismaService],
        }).compile();

        service = module.get<NotificationsService>(NotificationsService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a notification token', async () => {
        const notification: CreateNotificationDto = {
            expoPushToken: 'testExpoPushToken',
        };

        jest.spyOn(
            prismaService.notificationTokens,
            'create',
        ).mockResolvedValue({
            id: 'mockId',
            token: 'testExpoPushToken',
            userId: 'userId',
        });

        await expect(
            service.create('userId', notification),
        ).resolves.not.toThrow();

        expect(prismaService.notificationTokens.create).toHaveBeenCalledWith({
            select: {
                id: true,
            },
            data: {
                user: {
                    connect: {
                        id: 'userId',
                    },
                },
                token: 'testExpoPushToken',
            },
        });
    });
});

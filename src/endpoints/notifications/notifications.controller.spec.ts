import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

describe('NotificationsController', () => {
    let controller: NotificationsController;
    let service: NotificationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [NotificationsController],
            providers: [NotificationsService, PrismaService],
        }).compile();

        controller = module.get<NotificationsController>(
            NotificationsController,
        );
        service = module.get<NotificationsService>(NotificationsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a notification', async () => {
        const request = { user: { id: 'userId' } } as any;
        const notification: CreateNotificationDto = {
            expoPushToken: 'testExpoPushToken',
        };

        jest.spyOn(service, 'create').mockResolvedValue();

        await expect(
            controller.create(request, notification),
        ).resolves.not.toThrow();

        expect(service.create).toHaveBeenCalledWith('userId', notification);
    });
});

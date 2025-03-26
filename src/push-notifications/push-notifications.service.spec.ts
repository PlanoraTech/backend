import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { PushNotificationsService } from './push-notifications.service';
import { HttpModule } from '@nestjs/axios';

describe('PushNotificationsService', () => {
    let service: PushNotificationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [HttpModule],
            providers: [PushNotificationsService, PrismaService],
        }).compile();

        service = module.get<PushNotificationsService>(
            PushNotificationsService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

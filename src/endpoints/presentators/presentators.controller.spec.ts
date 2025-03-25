import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { PushNotificationsService } from '@app/push-notifications/push-notifications.service';
import { PresentatorsController } from './presentators.controller';
import { PresentatorsService } from './presentators.service';

describe('PresentatorsController', () => {
  let controller: PresentatorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [PresentatorsController],
      providers: [PresentatorsService, PushNotificationsService, PrismaService],
    }).compile();

    controller = module.get<PresentatorsController>(PresentatorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

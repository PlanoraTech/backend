import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

describe('RoomsController', () => {
  let controller: RoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [RoomsService, PrismaService],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { PresentatorsController } from './presentators.controller';
import { PresentatorsService } from './presentators.service';

describe('PresentatorsController', () => {
  let controller: PresentatorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresentatorsController],
      providers: [PresentatorsService, PrismaService],
    }).compile();

    controller = module.get<PresentatorsController>(PresentatorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
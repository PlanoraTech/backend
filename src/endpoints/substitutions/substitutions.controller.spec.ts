import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { SubstitutionsController } from './substitutions.controller';
import { SubstitutionsService } from './substitutions.service';

describe('SubstitutionController', () => {
  let controller: SubstitutionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubstitutionsController],
      providers: [SubstitutionsService, PrismaService],
    }).compile();

    controller = module.get<SubstitutionsController>(SubstitutionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

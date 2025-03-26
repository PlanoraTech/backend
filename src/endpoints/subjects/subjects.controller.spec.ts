import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';

describe('SubjectsController', () => {
  let controller: SubjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectsController],
      providers: [SubjectsService, PrismaService],
    }).compile();

    controller = module.get<SubjectsController>(SubjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

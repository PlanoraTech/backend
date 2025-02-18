import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { TimeTablesController } from './timetables.controller';
import { TimeTablesService } from './timetables.service';

describe('TimeTablesController', () => {
  let controller: TimeTablesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeTablesController],
      providers: [TimeTablesService, PrismaService],
    }).compile();

    controller = module.get<TimeTablesController>(TimeTablesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
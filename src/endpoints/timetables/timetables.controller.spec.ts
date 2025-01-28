import { Test, TestingModule } from '@nestjs/testing';
import { TimeTablesController } from './timetables.controller';
import { TimeTablesService } from './timetables.service';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from '../institutions/institutions.service';

describe('TimeTablesController', () => {
  let controller: TimeTablesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeTablesController],
      providers: [TimeTablesService, InstitutionsService, PrismaClient],
    }).compile();

    controller = module.get<TimeTablesController>(TimeTablesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

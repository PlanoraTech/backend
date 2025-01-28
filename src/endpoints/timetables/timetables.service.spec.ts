import { Test, TestingModule } from '@nestjs/testing';
import { TimeTablesService } from './timetables.service';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from '../institutions/institutions.service';

describe('TimeTablesService', () => {
  let service: TimeTablesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeTablesService, InstitutionsService, PrismaClient],
    }).compile();

    service = module.get<TimeTablesService>(TimeTablesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
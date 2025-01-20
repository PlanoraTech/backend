import { Test, TestingModule } from '@nestjs/testing';
import { TimeTablesService } from './timetables.service';

describe('TimeTablesService', () => {
  let service: TimeTablesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeTablesService],
    }).compile();

    service = module.get<TimeTablesService>(TimeTablesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

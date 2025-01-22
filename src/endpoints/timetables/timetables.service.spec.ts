import { Test, TestingModule } from '@nestjs/testing';
import { TimeTablesService } from './timetables.service';
import { GroupsService } from '../groups/groups.service';

describe('TimeTablesService', () => {
  let service: TimeTablesService<GroupsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeTablesService],
    }).compile();

    service = module.get<TimeTablesService<GroupsService>>(TimeTablesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

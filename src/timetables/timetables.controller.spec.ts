import { Test, TestingModule } from '@nestjs/testing';
import { TimetablesController } from './timetables.controller';
import { TimetablesService } from './timetables.service';

describe('TimetablesController', () => {
  let controller: TimetablesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimetablesController],
      providers: [TimetablesService],
    }).compile();

    controller = module.get<TimetablesController>(TimetablesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

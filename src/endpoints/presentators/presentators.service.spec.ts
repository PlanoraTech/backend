import { Test, TestingModule } from '@nestjs/testing';
import { PresentatorsService } from './presentators.service';

describe('PresentatorsService', () => {
  let service: PresentatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresentatorsService],
    }).compile();

    service = module.get<PresentatorsService>(PresentatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { SubstitutionsService } from './substitutions.service';

describe('SubstitutionService', () => {
  let service: SubstitutionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubstitutionsService, PrismaService],
    }).compile();

    service = module.get<SubstitutionsService>(SubstitutionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

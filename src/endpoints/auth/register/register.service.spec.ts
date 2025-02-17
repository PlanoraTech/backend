import { Test, TestingModule } from '@nestjs/testing';
import { RegisterService } from './register.service';
import { PrismaClient } from '@prisma/client';

describe('RegisterService', () => {
  let service: RegisterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegisterService, PrismaClient],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
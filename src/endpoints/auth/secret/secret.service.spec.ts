import { Test, TestingModule } from '@nestjs/testing';
import { SecretService } from './secret.service';
import { PrismaClient } from '@prisma/client';

describe('SecretService', () => {
  let service: SecretService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecretService, PrismaClient],
    }).compile();

    service = module.get<SecretService>(SecretService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

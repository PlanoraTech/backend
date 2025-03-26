import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { SecretService } from '@app/auth/secret/secret.service';
import { RegisterService } from './register.service';

describe('RegisterService', () => {
  let service: RegisterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegisterService, SecretService, PrismaService],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

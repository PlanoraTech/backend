import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { PrismaClient } from '@prisma/client';

describe('LoginController', () => {
  let controller: LoginController;
  let prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [LoginService, PrismaClient],
    }).compile();

    controller = module.get<LoginController>(LoginController);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

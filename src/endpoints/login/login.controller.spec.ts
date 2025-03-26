import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { SecretService } from '@app/auth/secret/secret.service';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

describe('LoginController', () => {
    let controller: LoginController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoginController],
            providers: [LoginService, SecretService, PrismaService],
        }).compile();

        controller = module.get<LoginController>(LoginController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { SecretService } from '@app/auth/secret/secret.service';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';

describe('LoginService', () => {
    let service: LoginService;
    let prismaService: PrismaService;
    let secretService: SecretService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LoginService, SecretService, PrismaService],
        }).compile();

        service = module.get<LoginService>(LoginService);
        prismaService = module.get<PrismaService>(PrismaService);
        secretService = module.get<SecretService>(SecretService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should login successfully with valid credentials', async () => {
        const login: LoginDto = {
            email: 'test@example.com',
            password: 'password123',
            rememberMe: true,
        };

        const user = {
            id: '1',
            email: 'test@example.com',
            password: 'hashedPassword',
            institutions: [
                {
                    institutionId: 'inst1',
                    role: 'PRESENTATOR',
                    presentatorId: 'pres1',
                },
            ],
        };

        jest.spyOn(prismaService.users, 'findUniqueOrThrow').mockResolvedValue(
            user,
        );
        jest.spyOn(secretService, 'comparePassword').mockResolvedValue(true);
        jest.spyOn(secretService, 'createToken').mockResolvedValue({
            token: 'token',
        });

        const result = await service.loginByEmailAndPassword(login);

        expect(result).toEqual({
            user: {
                institutions: user.institutions,
            },
            token: 'token',
        });
    });

    it('should throw NotFoundException for invalid credentials', async () => {
        const login: LoginDto = {
            email: 'test@example.com',
            password: 'wrongPassword',
            rememberMe: false,
        };

        const user = {
            id: '1',
            email: 'test@example.com',
            password: 'hashedPassword',
            institutions: [],
        };

        jest.spyOn(prismaService.users, 'findUniqueOrThrow').mockResolvedValue(
            user,
        );
        jest.spyOn(secretService, 'comparePassword').mockResolvedValue(false);

        await expect(service.loginByEmailAndPassword(login)).rejects.toThrow(
            NotFoundException,
        );
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { SecretService } from '@app/auth/secret/secret.service';
import { RegisterService } from './register.service';
import { RegisterDto } from './dto/register.dto';

describe('RegisterService', () => {
    let service: RegisterService;
    let prismaService: PrismaService;
    let secretService: SecretService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RegisterService, SecretService, PrismaService],
        }).compile();

        service = module.get<RegisterService>(RegisterService);
        prismaService = module.get<PrismaService>(PrismaService);
        secretService = module.get<SecretService>(SecretService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a new user and return a token', async () => {
        const register: RegisterDto = {
            email: 'test@example.com',
            password: 'password123',
        };

        jest.spyOn(secretService, 'encryptPassword').mockResolvedValue(
            'encryptedPassword',
        );
        jest.spyOn(prismaService.users, 'create').mockResolvedValue({
            id: 'userId',
        } as any);
        jest.spyOn(secretService, 'createToken').mockResolvedValue({
            token: 'testToken',
        });

        const result = await service.create(register);

        expect(result).toEqual({ token: 'testToken' });
        expect(secretService.encryptPassword).toHaveBeenCalledWith(
            'password123',
        );
        expect(prismaService.users.create).toHaveBeenCalledWith({
            select: { id: true },
            data: {
                email: 'test@example.com',
                password: 'encryptedPassword',
            },
        });
    });

    it('should throw ConflictException if user already exists', async () => {
        const register: RegisterDto = {
            email: 'test@example.com',
            password: 'password123',
        };

        jest.spyOn(prismaService.users, 'create').mockRejectedValue(
            new ConflictException('User already exists'),
        );

        await expect(service.create(register)).rejects.toThrow(
            ConflictException,
        );
    });
});

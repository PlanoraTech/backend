import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { SecretService } from '@app/auth/secret/secret.service';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { RegisterDto } from './dto/register.dto';

describe('RegisterController', () => {
    let controller: RegisterController;
    let service: RegisterService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RegisterController],
            providers: [RegisterService, SecretService, PrismaService],
        }).compile();

        controller = module.get<RegisterController>(RegisterController);
        service = module.get<RegisterService>(RegisterService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should register a new user and return a token', async () => {
        const register: RegisterDto = {
            email: 'test@example.com',
            password: 'password123',
        };

        jest.spyOn(service, 'create').mockResolvedValue({ token: 'testToken' });

        const result = await controller.create(register);
        expect(result).toEqual({ token: 'testToken' });
        expect(service.create).toHaveBeenCalledWith(register);
    });

    it('should throw ConflictException if user already exists', async () => {
        const register: RegisterDto = {
            email: 'test@example.com',
            password: 'password123',
        };

        jest.spyOn(service, 'create').mockRejectedValue(
            new ConflictException('User already exists'),
        );

        await expect(controller.create(register)).rejects.toThrow(
            ConflictException,
        );
    });
});

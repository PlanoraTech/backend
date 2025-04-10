import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { SecretService } from '@app/auth/secret/secret.service';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';

describe('LoginController', () => {
    let controller: LoginController;
    let service: LoginService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoginController],
            providers: [LoginService, SecretService, PrismaService],
        }).compile();

        controller = module.get<LoginController>(LoginController);
        service = module.get<LoginService>(LoginService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should authenticate a user with valid credentials', async () => {
        const login: LoginDto = {
            email: 'test@example.com',
            password: 'password123',
            rememberMe: true,
        };

        const user = {
            user: {
                institutions: [
                    {
                        institutionId: 'inst1',
                        role: 'PRESENTATOR',
                        presentatorId: 'pres1',
                    },
                ],
            },
            token: 'token',
        } as any;

        jest.spyOn(service, 'loginByEmailAndPassword').mockResolvedValue(user);

        const result = await controller.login(login);
        expect(result).toEqual(user);
    });

    it('should return authenticated user details for autologin', () => {
        const request = {
            user: {
                institutions: [
                    {
                        institutionId: 'inst1',
                        role: 'admin',
                        presentatorId: 'pres1',
                    },
                ],
            },
        } as any;

        const result = controller.autologin(request);
        expect(result).toEqual({
            user: {
                institutions: request.user.institutions,
            },
        });
    });
});

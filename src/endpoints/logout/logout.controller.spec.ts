import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { LogoutController } from './logout.controller';
import { LogoutService } from './logout.service';

describe('LogoutController', () => {
    let controller: LogoutController;
    let service: LogoutService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LogoutController],
            providers: [LogoutService, PrismaService],
        }).compile();

        controller = module.get<LogoutController>(LogoutController);
        service = module.get<LogoutService>(LogoutService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should log out successfully with a valid token', async () => {
        jest.spyOn(service, 'logout').mockResolvedValue();
        const request = { token: 'validToken' } as any;
        await expect(controller.logout(request)).resolves.not.toThrow();
    });

    it('should throw UnauthorizedException for an invalid token', async () => {
        jest.spyOn(service, 'logout').mockRejectedValue(
            new UnauthorizedException('Invalid token'),
        );
        const request = { token: 'invalidToken' } as any;
        await expect(controller.logout(request)).rejects.toThrow(
            UnauthorizedException,
        );
    });

    it('should log out globally for a user', async () => {
        jest.spyOn(service, 'logoutGlobally').mockResolvedValue();
        const request = { user: { id: 'userId' } } as any;
        await expect(controller.logoutGlobally(request)).resolves.not.toThrow();
    });
});

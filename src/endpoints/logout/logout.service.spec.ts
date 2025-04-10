import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LogoutService } from './logout.service';

describe('LogoutService', () => {
    let service: LogoutService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LogoutService, PrismaService],
        }).compile();

        service = module.get<LogoutService>(LogoutService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should logout successfully with a valid token', async () => {
        jest.spyOn(prismaService.tokens, 'delete').mockResolvedValue({
            id: 'tokenId',
            token: 'validToken',
            expiry: new Date(),
            userId: 'userId',
        });
        await expect(service.logout('validToken')).resolves.not.toThrow();
    });

    it('should throw UnauthorizedException for an invalid token', async () => {
        jest.spyOn(prismaService.tokens, 'delete').mockRejectedValue(
            new PrismaClientKnownRequestError('Invalid token', {
                code: 'P2025',
                clientVersion: 'prisma-client-js',
            }),
        );
        await expect(service.logout('invalidToken')).rejects.toThrow(
            UnauthorizedException,
        );
    });

    it('should logout globally for a user', async () => {
        jest.spyOn(prismaService.tokens, 'deleteMany').mockResolvedValue({
            count: 1,
        });
        await expect(service.logoutGlobally('userId')).resolves.not.toThrow();
    });
});

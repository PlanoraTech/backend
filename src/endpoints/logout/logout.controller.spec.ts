import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { LogoutController } from './logout.controller';
import { LogoutService } from './logout.service';

describe('LogoutController', () => {
    let controller: LogoutController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LogoutController],
            providers: [LogoutService, PrismaService],
        }).compile();

        controller = module.get<LogoutController>(LogoutController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

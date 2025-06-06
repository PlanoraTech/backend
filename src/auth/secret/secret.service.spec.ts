import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { SecretService } from './secret.service';

describe('SecretService', () => {
    let service: SecretService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SecretService, PrismaService],
        }).compile();

        service = module.get<SecretService>(SecretService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { SubjectsService } from './subjects.service';

describe('SubjectsService', () => {
    let service: SubjectsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SubjectsService, PrismaService],
        }).compile();

        service = module.get<SubjectsService>(SubjectsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

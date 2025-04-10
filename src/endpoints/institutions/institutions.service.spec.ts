import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { InstitutionsService } from './institutions.service';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

describe('InstitutionsService', () => {
    let service: InstitutionsService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [InstitutionsService, PrismaService],
        }).compile();

        service = module.get<InstitutionsService>(InstitutionsService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should retrieve all institutions', async () => {
        const institutions = [
            {
                id: '1',
                name: 'Test Institution 1',
                type: 'SCHOOL',
                access: 'PUBLIC',
                color: 'Blue',
                website: 'https://example.com',
            },
            {
                id: '2',
                name: 'Test Institution 2',
                type: 'SCHOOL',
                access: 'PUBLIC',
                color: 'Green',
                website: 'https://example2.com',
            },
        ] as any[];
        jest.spyOn(prismaService.institutions, 'findMany').mockResolvedValue(
            institutions,
        );
        const result = await service.findAll();
        expect(result).toEqual(institutions);
    });

    it('should retrieve a specific institution', async () => {
        const institution = {
            id: '1',
            name: 'Test Institution',
            type: 'SCHOOL',
            access: 'PUBLIC',
            color: 'Blue',
            website: 'https://example.com',
        } as any;
        jest.spyOn(
            prismaService.institutions,
            'findUniqueOrThrow',
        ).mockResolvedValue(institution);
        const result = await service.findOne('1');
        expect(result).toEqual(institution);
    });

    it('should update an institution', async () => {
        jest.spyOn(prismaService.institutions, 'update').mockResolvedValue({
            id: '1',
            name: 'Updated Institution',
            type: 'SCHOOL',
            access: 'PUBLIC',
            color: 'Blue',
            website: 'https://new-website.com',
        });
        await expect(
            service.update('1', {
                website: 'https://new-website.com',
            } as UpdateInstitutionDto),
        ).resolves.not.toThrow();
    });
});

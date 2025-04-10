import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { InstitutionsController } from './institutions.controller';
import { InstitutionsService } from './institutions.service';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

describe('InstitutionsController', () => {
    let controller: InstitutionsController;
    let service: InstitutionsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [InstitutionsController],
            providers: [InstitutionsService, PrismaService],
        }).compile();

        controller = module.get<InstitutionsController>(InstitutionsController);
        service = module.get<InstitutionsService>(InstitutionsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should retrieve all institutions', async () => {
        const institutions = [
            {
                id: '1',
                name: 'Test Institution',
                type: 'SCHOOL',
                access: 'PUBLIC',
                color: 'Blue',
                website: 'https://example.com',
            },
        ] as any[];
        jest.spyOn(service, 'findAll').mockResolvedValue(institutions);
        const result = await controller.findAll();
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
        jest.spyOn(service, 'findOne').mockResolvedValue(institution);
        const result = await controller.findOne('1');
        expect(result).toEqual(institution);
    });

    it('should update an institution', async () => {
        jest.spyOn(service, 'update').mockResolvedValue();
        await expect(
            controller.update('1', {
                website: 'https://new-website.com',
            } as UpdateInstitutionDto),
        ).resolves.not.toThrow();
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { SubstitutionsController } from './substitutions.controller';
import { SubstitutionsService } from './substitutions.service';

describe('SubstitutionsController', () => {
    let controller: SubstitutionsController;
    let service: SubstitutionsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SubstitutionsController],
            providers: [SubstitutionsService, PrismaService],
        }).compile();

        controller = module.get<SubstitutionsController>(
            SubstitutionsController,
        );
        service = module.get<SubstitutionsService>(SubstitutionsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should retrieve all substitutions', async () => {
        const substitutions = [
            { id: '1', from: new Date(), to: new Date(), presentatorId: '123' },
        ] as any;

        jest.spyOn(service, 'findAll').mockResolvedValue(substitutions);

        const result = await controller.findAll(
            'institutionId',
            'presentatorId',
        );
        expect(result).toEqual(substitutions);
        expect(service.findAll).toHaveBeenCalledWith(
            'institutionId',
            'presentatorId',
        );
    });

    it('should retrieve a specific substitution', async () => {
        const substitution = {
            id: '1',
            from: new Date(),
            to: new Date(),
            presentatorId: '123',
        } as any;

        jest.spyOn(service, 'findOne').mockResolvedValue(substitution);

        const result = await controller.findOne(
            'institutionId',
            'presentatorId',
            '1',
        );
        expect(result).toEqual(substitution);
        expect(service.findOne).toHaveBeenCalledWith(
            'institutionId',
            'presentatorId',
            '1',
        );
    });
});

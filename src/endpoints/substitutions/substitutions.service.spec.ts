import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { SubstitutionsService } from './substitutions.service';

describe('SubstitutionsService', () => {
    let service: SubstitutionsService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SubstitutionsService, PrismaService],
        }).compile();

        service = module.get<SubstitutionsService>(SubstitutionsService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should retrieve all substitutions for a presentator', async () => {
        const substitutions = [
            {
                id: '1',
                from: new Date(),
                to: new Date(),
                presentatorId: 'presentatorId',
            },
        ];

        jest.spyOn(prismaService.substitutions, 'findMany').mockResolvedValue(
            substitutions,
        );

        const result = await service.findAll('institutionId', 'presentatorId');
        expect(result).toEqual(substitutions);
        expect(prismaService.substitutions.findMany).toHaveBeenCalledWith({
            select: {
                id: true,
                from: true,
                to: true,
                presentatorId: false,
            },
            where: {
                presentator: {
                    id: 'presentatorId',
                    institutions: {
                        some: {
                            id: 'institutionId',
                        },
                    },
                },
            },
        });
    });

    it('should retrieve a specific substitution by ID', async () => {
        const substitution = {
            id: '1',
            from: new Date(),
            to: new Date(),
            presentatorId: 'presentatorId',
        };

        jest.spyOn(
            prismaService.substitutions,
            'findUniqueOrThrow',
        ).mockResolvedValue(substitution);

        const result = await service.findOne(
            'institutionId',
            'presentatorId',
            '1',
        );
        expect(result).toEqual(substitution);
        expect(
            prismaService.substitutions.findUniqueOrThrow,
        ).toHaveBeenCalledWith({
            select: {
                id: true,
                from: true,
                to: true,
                presentatorId: false,
            },
            where: {
                id: '1',
                presentator: {
                    id: 'presentatorId',
                    institutions: {
                        some: {
                            id: 'institutionId',
                        },
                    },
                },
            },
        });
    });

    it('should throw NotFoundException if substitution is not found', async () => {
        jest.spyOn(
            prismaService.substitutions,
            'findUniqueOrThrow',
        ).mockRejectedValue(new NotFoundException('Substitution not found'));

        await expect(
            service.findOne('institutionId', 'presentatorId', 'invalidId'),
        ).rejects.toThrow(NotFoundException);
    });
});

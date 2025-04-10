import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { TimeTablesService } from './timetables.service';
import { CreateTimeTableDto } from './dto/create-timetable.dto';
import { UpdateTimeTableDto } from './dto/update-timetable.dto';

describe('TimeTablesService', () => {
    let service: TimeTablesService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TimeTablesService, PrismaService],
        }).compile();

        service = module.get<TimeTablesService>(TimeTablesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a timetable', async () => {
        const timetable: CreateTimeTableDto = { name: 'Timetable 1' };
        jest.spyOn(prismaService.timeTables, 'create').mockResolvedValue({
            id: '1',
            name: 'Timetable 1',
            institutionId: 'institutionId',
        });

        await expect(
            service.create('institutionId', timetable),
        ).resolves.not.toThrow();
        expect(prismaService.timeTables.create).toHaveBeenCalledWith({
            select: { id: true },
            data: { institutionId: 'institutionId', ...timetable },
        });
    });

    it('should retrieve all timetables', async () => {
        const timetables = [
            { id: '1', name: 'Timetable 1', institutionId: 'institutionId' },
        ];
        jest.spyOn(prismaService.timeTables, 'findMany').mockResolvedValue(
            timetables,
        );

        const result = await service.findAll('institutionId');
        expect(result).toEqual(timetables);
        expect(prismaService.timeTables.findMany).toHaveBeenCalledWith({
            select: { id: true, name: true, institutionId: false },
            where: { institutionId: 'institutionId' },
        });
    });

    it('should retrieve a specific timetable', async () => {
        const timetable = {
            id: '1',
            name: 'Timetable 1',
            institutionId: 'institutionId',
        };
        jest.spyOn(
            prismaService.timeTables,
            'findUniqueOrThrow',
        ).mockResolvedValue(timetable);

        const result = await service.findOne('institutionId', '1');
        expect(result).toEqual(timetable);
        expect(prismaService.timeTables.findUniqueOrThrow).toHaveBeenCalledWith(
            {
                select: { id: true, name: true, institutionId: false },
                where: { id: '1', institutionId: 'institutionId' },
            },
        );
    });

    it('should update a timetable', async () => {
        const timetable: UpdateTimeTableDto = { name: 'Updated Timetable' };
        jest.spyOn(prismaService.timeTables, 'update').mockResolvedValue({
            id: '1',
            name: 'Timetable 1',
            institutionId: 'institutionId',
        });

        await expect(
            service.update('institutionId', '1', timetable),
        ).resolves.not.toThrow();
        expect(prismaService.timeTables.update).toHaveBeenCalledWith({
            select: { id: true },
            data: timetable,
            where: { id: '1', institutionId: 'institutionId' },
        });
    });

    it('should remove a timetable', async () => {
        jest.spyOn(prismaService, '$transaction').mockResolvedValue(undefined);

        await expect(
            service.remove('institutionId', '1'),
        ).resolves.not.toThrow();
        expect(prismaService.$transaction).toHaveBeenCalledWith([
            prismaService.appointments.deleteMany({
                where: {
                    timetables: {
                        some: { id: '1', institutionId: 'institutionId' },
                    },
                },
            }),
            prismaService.timeTables.delete({
                select: { id: true },
                where: { id: '1', institutionId: 'institutionId' },
            }),
        ]);
    });
});

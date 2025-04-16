import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { TimeTablesController } from './timetables.controller';
import { TimeTablesService } from './timetables.service';
import { CreateTimeTableDto } from './dto/create-timetable.dto';
import { UpdateTimeTableDto } from './dto/update-timetable.dto';

describe('TimeTablesController', () => {
    let controller: TimeTablesController;
    let service: TimeTablesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TimeTablesController],
            providers: [TimeTablesService, PrismaService],
        }).compile();

        controller = module.get<TimeTablesController>(TimeTablesController);
        service = module.get<TimeTablesService>(TimeTablesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a timetable', async () => {
        jest.spyOn(service, 'create').mockResolvedValue();
        await expect(
            controller.create('institutionId', {
                name: 'Timetable Name',
            } as CreateTimeTableDto),
        ).resolves.not.toThrow();
    });

    it('should retrieve all timetables', async () => {
        const timetables = [
            {
                id: 'timetableId',
                name: 'Timetable Name',
                version: 'B',
                institutionId: 'institutionId',
            },
        ] as any[];
        jest.spyOn(service, 'findAll').mockResolvedValue(timetables);
        const result = await controller.findAll('institutionId');
        expect(result).toEqual(timetables);
    });

    it('should retrieve a specific timetable', async () => {
        const timetable = {
            id: 'timetableId',
            name: 'Timetable Name',
            version: 'B',
            institutionId: 'institutionId',
        } as any;
        jest.spyOn(service, 'findOne').mockResolvedValue(timetable);
        const result = await controller.findOne('institutionId', 'timetableId');
        expect(result).toEqual(timetable);
    });

    it('should update a timetable', async () => {
        jest.spyOn(service, 'update').mockResolvedValue();
        await expect(
            controller.update('institutionId', 'timetableId', {
                name: 'Updated Timetable Name',
            } as UpdateTimeTableDto),
        ).resolves.not.toThrow();
    });

    it('should remove a timetable', async () => {
        jest.spyOn(service, 'remove').mockResolvedValue();
        await expect(
            controller.remove('institutionId', 'timetableId'),
        ).resolves.not.toThrow();
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import {
    AppointmentsController,
    AppointmentsFromTimeTablesController,
} from './appointments.controller';
import {
    AppointmentsFromTimeTablesService,
    AppointmentsService,
} from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

describe('AppointmentsController', () => {
    let controller: AppointmentsController;
    let service: AppointmentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppointmentsController],
            providers: [AppointmentsService, PrismaService],
        }).compile();

        controller = module.get<AppointmentsController>(AppointmentsController);
        service = module.get<AppointmentsService>(AppointmentsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should retrieve all appointments', async () => {
        const appointments = [
            {
                id: 'appointmentId',
                subjectId: 'subjectId',
                start: new Date('2023-01-01'),
                end: new Date('2023-01-02'),
                presentators: [],
                isCancelled: false,
                subject: {
                    id: 'subjectId',
                    name: 'Math',
                    subjectId: 'subjectId',
                },
                rooms: [{ id: 'roomId', name: 'Room A' }],
                timetables: [{ id: 'timetableId', name: 'Timetable 1' }],
            },
            {
                id: 'appointmentId2',
                subjectId: 'subjectId2',
                start: new Date('2023-01-03'),
                end: new Date('2023-01-04'),
                presentators: [],
                isCancelled: false,
                subject: {
                    id: 'subjectId2',
                    name: 'Science',
                    subjectId: 'subjectId2',
                },
                rooms: [{ id: 'roomId2', name: 'Room B' }],
                timetables: [{ id: 'timetableId2', name: 'Timetable 2' }],
            },
        ];
        jest.spyOn(service, 'findAll').mockResolvedValue(appointments);
        const result = await controller.findAll(
            'institutionId',
            'timetableId',
            'presentatorId',
            'roomId',
        );
        expect(result).toEqual(appointments);
    });

    it('should retrieve a specific appointment', async () => {
        const appointment = {
            id: 'appointmentId',
            subjectId: 'subjectId',
            start: new Date('2023-01-01'),
            end: new Date('2023-01-02'),
            isCancelled: false,
            presentators: [],
            subject: { id: 'subjectId', name: 'Math', subjectId: 'subjectId' },
            rooms: [{ id: 'roomId', name: 'Room A' }],
            timetables: [{ id: 'timetableId', name: 'Timetable 1' }],
        };
        jest.spyOn(service, 'findOne').mockResolvedValue(appointment);
        const result = await controller.findOne(
            'institutionId',
            'timetableId',
            'presentatorId',
            'roomId',
            'appointmentId',
        );
        expect(result).toEqual(appointment);
    });
});

describe('AppointmentsFromTimeTablesController', () => {
    let controller: AppointmentsFromTimeTablesController;
    let service: AppointmentsFromTimeTablesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppointmentsFromTimeTablesController],
            providers: [AppointmentsFromTimeTablesService, PrismaService],
        }).compile();

        controller = module.get<AppointmentsFromTimeTablesController>(
            AppointmentsFromTimeTablesController,
        );
        service = module.get<AppointmentsFromTimeTablesService>(
            AppointmentsFromTimeTablesService,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create an appointment', async () => {
        jest.spyOn(service, 'create').mockResolvedValue({
            id: 'appointmentId',
        });
        await expect(
            controller.create('institutionId', 'timetableId', {
                start: new Date('2023-01-01'),
                end: new Date('2023-01-02'),
                subjectId: 'subjectId',
            } as CreateAppointmentDto),
        ).resolves.not.toThrow();
    });

    it('should update an appointment', async () => {
        jest.spyOn(service, 'update').mockResolvedValue();
        await expect(
            controller.update('institutionId', 'timetableId', 'appointmentId', {
                start: new Date('2023-01-01'),
                end: new Date('2023-01-02'),
                isCancelled: true,
                subjectId: 'subjectId',
            } as UpdateAppointmentDto),
        ).resolves.not.toThrow();
    });

    it('should remove an appointment', async () => {
        jest.spyOn(service, 'remove').mockResolvedValue();
        await expect(
            controller.remove('institutionId', 'timetableId', 'appointmentId'),
        ).resolves.not.toThrow();
    });
});

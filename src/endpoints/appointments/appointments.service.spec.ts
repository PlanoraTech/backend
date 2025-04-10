import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import {
    AppointmentsFromTimeTablesService,
    AppointmentsService,
} from './appointments.service';
import { DataService } from '@app/interfaces/DataService.interface';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

describe('AppointmentsService', () => {
    let service: AppointmentsService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AppointmentsService, PrismaService],
        }).compile();

        service = module.get<AppointmentsService>(AppointmentsService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should find all appointments', async () => {
        const appointments = [
            {
                id: 'appointmentId',
                subjectId: 'subjectId',
                start: new Date('2023-01-01'),
                end: new Date('2023-01-02'),
                presentators: [],
                isCancelled: false,
            },
            {
                id: 'appointmentId2',
                subjectId: 'subjectId2',
                start: new Date('2023-01-03'),
                end: new Date('2023-01-04'),
                presentators: [],
                isCancelled: false,
            },
        ];
        jest.spyOn(prismaService.appointments, 'findMany').mockResolvedValue(
            appointments,
        );
        const result = await service.findAll('institutionId', {
            timetableId: 'timetableId',
            roomId: 'roomId',
            presentatorId: 'presentatorId',
        } as DataService);
        expect(result).toEqual(appointments);
    });

    it('should find one appointment', async () => {
        const appointment = {
            id: 'appointmentId',
            subjectId: 'subjectId',
            start: new Date('2023-01-01'),
            end: new Date('2023-01-02'),
            presentators: [],
            isCancelled: false,
        };
        jest.spyOn(
            prismaService.appointments,
            'findUniqueOrThrow',
        ).mockResolvedValue(appointment);
        const result = await service.findOne(
            'institutionId',
            {
                timetableId: 'timetableId',
                roomId: 'roomId',
                presentatorId: 'presentatorId',
            } as DataService,
            'appointmentId',
        );
        expect(result).toEqual(appointment);
    });
});

describe('AppointmentsFromTimeTablesService', () => {
    let service: AppointmentsFromTimeTablesService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AppointmentsFromTimeTablesService, PrismaService],
        }).compile();

        service = module.get<AppointmentsFromTimeTablesService>(
            AppointmentsFromTimeTablesService,
        );
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create an appointment', async () => {
        jest.spyOn(prismaService.appointments, 'create').mockResolvedValue({
            id: 'appointmentId',
            subjectId: 'subjectId',
            start: new Date('2023-01-01'),
            end: new Date('2023-01-02'),
            isCancelled: false,
        });
        await expect(
            service.create('institutionId', {
                start: new Date('2023-01-01'),
                end: new Date('2023-01-02'),
                subjectId: 'subjectId',
            } as CreateAppointmentDto),
        ).resolves.not.toThrow();
    });

    it('should update an appointment', async () => {
        jest.spyOn(prismaService.appointments, 'update').mockResolvedValue({
            id: 'appointmentId',
            subjectId: 'subjectId',
            start: new Date('2023-01-01'),
            end: new Date('2023-01-02'),
            isCancelled: true,
        });
        await expect(
            service.update('institutionId', 'timetableId', 'appointmentId', {
                start: new Date('2023-01-01'),
                end: new Date('2023-01-02'),
                isCancelled: true,
                subjectId: 'subjectId',
            } as UpdateAppointmentDto),
        ).resolves.not.toThrow();
    });

    it('should remove an appointment', async () => {
        jest.spyOn(
            prismaService.presentatorsToAppointments,
            'deleteMany',
        ).mockResolvedValue({ count: 1 });
        jest.spyOn(prismaService.appointments, 'delete').mockResolvedValue({
            id: 'appointmentId',
            subjectId: 'subjectId',
            start: new Date('2023-01-01'),
            end: new Date('2023-01-02'),
            isCancelled: false,
        });
        await expect(
            service.remove('institutionId', 'timetableId', 'appointmentId'),
        ).resolves.not.toThrow();
    });
});

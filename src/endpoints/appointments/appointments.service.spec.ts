import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import {
    AppointmentsFromTimeTablesService,
    AppointmentsService,
} from './appointments.service';

describe('AppointmentsService', () => {
    let service: AppointmentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AppointmentsService, PrismaService],
        }).compile();

        service = module.get<AppointmentsService>(AppointmentsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

describe('AppointmentsFromInstitutionsTimeTablesService', () => {
    let service: AppointmentsFromTimeTablesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AppointmentsFromTimeTablesService, PrismaService],
        }).compile();

        service = module.get<AppointmentsFromTimeTablesService>(
            AppointmentsFromTimeTablesService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

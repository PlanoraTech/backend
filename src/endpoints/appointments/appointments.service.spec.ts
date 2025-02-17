import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsFromTimeTablesService, AppointmentsService } from './appointments.service';
import { PrismaClient } from '@prisma/client';

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentsService, PrismaClient],
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
      providers: [AppointmentsFromTimeTablesService, PrismaClient],
    }).compile();

    service = module.get<AppointmentsFromTimeTablesService>(AppointmentsFromTimeTablesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
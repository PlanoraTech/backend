import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsFromInstitutionsTimeTablesService, AppointmentsFromPresentatorsService, AppointmentsFromRoomsService } from './appointments.service';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from '../institutions/institutions.service';
import { TimeTablesService } from '../timetables/timetables.service';
import { PresentatorsService } from '../presentators/presentators.service';
import { RoomsService } from '../rooms/rooms.service';

describe('AppointmentsFromInstitutionsTimeTablesService', () => {
  let service: AppointmentsFromInstitutionsTimeTablesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentsFromInstitutionsTimeTablesService, RoomsService, PresentatorsService, TimeTablesService, InstitutionsService, PrismaClient],
    }).compile();

    service = module.get<AppointmentsFromInstitutionsTimeTablesService>(AppointmentsFromInstitutionsTimeTablesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('AppointmentsFromPresentatorsService', () => {
  let service: AppointmentsFromPresentatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentsFromPresentatorsService, RoomsService, PresentatorsService, TimeTablesService, InstitutionsService, PrismaClient],
    }).compile();

    service = module.get<AppointmentsFromPresentatorsService>(AppointmentsFromPresentatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('AppointmentsFromRoomsService', () => {
  let service: AppointmentsFromRoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentsFromRoomsService, RoomsService, PresentatorsService, TimeTablesService, InstitutionsService, PrismaClient],
    }).compile();

    service = module.get<AppointmentsFromRoomsService>(AppointmentsFromRoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
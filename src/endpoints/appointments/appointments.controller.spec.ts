import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsFromPresentatorsController, AppointmentsFromRoomsController, AppointmentsFromTimeTablesController } from './appointments.controller';
import { AppointmentsFromInstitutionsTimeTablesService, AppointmentsFromPresentatorsService, AppointmentsFromRoomsService } from './appointments.service';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from '../institutions/institutions.service';
import { PresentatorsService } from '../presentators/presentators.service';
import { RoomsService } from '../rooms/rooms.service';
import { TimeTablesService } from '../timetables/timetables.service';

describe('AppointmentsFromTimeTablesController', () => {
  let controller: AppointmentsFromTimeTablesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsFromTimeTablesController],
      providers: [AppointmentsFromInstitutionsTimeTablesService, RoomsService, PresentatorsService, TimeTablesService, InstitutionsService, PrismaClient],
    }).compile();

    controller = module.get<AppointmentsFromTimeTablesController>(AppointmentsFromTimeTablesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

describe('AppointmentsFromPresentatorsController', () => {
  let controller: AppointmentsFromPresentatorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsFromPresentatorsController],
      providers: [AppointmentsFromPresentatorsService, RoomsService, PresentatorsService, TimeTablesService, InstitutionsService, PrismaClient],
    }).compile();

    controller = module.get<AppointmentsFromPresentatorsController>(AppointmentsFromPresentatorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

describe('AppointmentsFromRoomsController', () => {
  let controller: AppointmentsFromRoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsFromRoomsController],
      providers: [AppointmentsFromRoomsService, RoomsService, PresentatorsService, TimeTablesService, InstitutionsService, PrismaClient],
    }).compile();

    controller = module.get<AppointmentsFromRoomsController>(AppointmentsFromRoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

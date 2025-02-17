import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController, AppointmentsFromTimeTablesController } from './appointments.controller';
import { AppointmentsFromTimeTablesService, AppointmentsService } from './appointments.service';
import { PrismaClient } from '@prisma/client';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [AppointmentsService, PrismaClient],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

describe('AppointmentsFromTimeTablesController', () => {
  let controller: AppointmentsFromTimeTablesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsFromTimeTablesController],
      providers: [AppointmentsFromTimeTablesService, PrismaClient],
    }).compile();

    controller = module.get<AppointmentsFromTimeTablesController>(AppointmentsFromTimeTablesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
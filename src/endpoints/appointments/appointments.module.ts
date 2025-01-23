import { Module } from '@nestjs/common';
import { AppointmentsFromRoomsService, AppointmentsFromInstitutionsTimeTablesService, AppointmentsFromPresentatorsService } from './appointments.service';
import { AppointmentsFromPresentatorsController, AppointmentsFromRoomsController, AppointmentsFromTimeTablesController } from './appointments.controller';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from 'src/endpoints/institutions/institutions.service';
import { PresentatorsService } from '../presentators/presentators.service';
import { RoomsService } from '../rooms/rooms.service';
import { TimeTablesService } from '../timetables/timetables.service';

@Module({
	controllers: [AppointmentsFromPresentatorsController, AppointmentsFromRoomsController, AppointmentsFromTimeTablesController],
	providers: [AppointmentsFromRoomsService, AppointmentsFromPresentatorsService, AppointmentsFromInstitutionsTimeTablesService, RoomsService, PresentatorsService, TimeTablesService, InstitutionsService, PrismaClient],
})
export class AppointmentsModule { }
import { Module } from '@nestjs/common';
import { AppointmentsFromGroupsTimeTablesController, AppointmentsFromPresentatorsController, AppointmentsFromRoomsController, AppointmentsFromTimeTablesController } from './appointments.controller';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from 'src/endpoints/institutions/institutions.service';
import { AppointmentsFromGroupsTimeTablesService, AppointmentsFromInstitutionsTimeTablesService, AppointmentsFromPresentatorsService, AppointmentsFromRoomsService } from './appointments.service';
import { GroupsService } from '../groups/groups.service';
import { RoomsService } from '../rooms/rooms.service';
import { PresentatorsService } from '../presentators/presentators.service';
import { TimeTablesFromGroupsService, TimeTablesFromInstitutionsService } from '../timetables/timetables.service';

@Module({
  controllers: [AppointmentsFromGroupsTimeTablesController, AppointmentsFromPresentatorsController, AppointmentsFromRoomsController, AppointmentsFromTimeTablesController],
  providers: [AppointmentsFromRoomsService, AppointmentsFromPresentatorsService, AppointmentsFromGroupsTimeTablesService, AppointmentsFromInstitutionsTimeTablesService, RoomsService, PresentatorsService, TimeTablesFromGroupsService, GroupsService, TimeTablesFromInstitutionsService, InstitutionsService, PrismaClient],
})
export class AppointmentsModule {}

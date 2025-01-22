import { Module } from '@nestjs/common';
import { TimeTablesFromGroupsController, TimeTablesFromInstitutionsController } from './timetables.controller';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from 'src/endpoints/institutions/institutions.service';
import { GroupsService } from '../groups/groups.service';
import { TimeTablesFromGroupsService, TimeTablesFromInstitutionsService } from './timetables.service';

@Module({
  controllers: [TimeTablesFromGroupsController, TimeTablesFromInstitutionsController],
  providers: [TimeTablesFromGroupsService, TimeTablesFromInstitutionsService, GroupsService, InstitutionsService, PrismaClient],
})
export class TimeTablesModule {}

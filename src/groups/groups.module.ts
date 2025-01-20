import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from 'src/institutions/institutions.service';
import { TimeTablesContext, TimeTablesModule } from 'src/timetables/timetables.module';
import { AppointmentsModule, AppointmentsContext } from 'src/appointments/appointments.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    TimeTablesModule.register(TimeTablesContext.GROUPS),
    AppointmentsModule.register(AppointmentsContext.TIMETABLES, TimeTablesContext.GROUPS),
    RouterModule.register([
      {
        path: 'institutions/:institutionsId/groups/:groupsId/timetables',
        module: TimeTablesModule,
        children: [
          {
            path: ':timetablesId/appointments',
            module: AppointmentsModule,
          },
        ],
      },
    ])
  ],
  controllers: [GroupsController],
  providers: [GroupsService, InstitutionsService, PrismaClient],
})
export class GroupsModule {}

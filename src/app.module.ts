import { Module } from '@nestjs/common';
import { InstitutionsModule } from './institutions/institutions.module';
import { RouterModule } from '@nestjs/core';
import { GroupsModule } from './groups/groups.module';
import { PresentatorsModule } from './presentators/presentators.module';
import { RoomsModule } from './rooms/rooms.module';
import { SubjectsModule } from './subjects/subjects.module';
import { UsersModule } from './users/users.module';
import { LoginModule } from './auth/login/login.module';
import { RegisterModule } from './auth/register/register.module';
import { AppointmentsModule, AppointmentsContext } from './appointments/appointments.module';
import { TimeTablesContext, TimeTablesModule } from './timetables/timetables.module';

const TimeTablesFromGroupsModule = TimeTablesModule.register(TimeTablesContext.GROUPS);
const TimeTablesFromInstitutionsModule = TimeTablesModule.register(TimeTablesContext.INSTITUTIONS);

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'institutions',
        module: InstitutionsModule,
        children: [
          {
            path: ':institutionsId/groups',
            module: GroupsModule,
            children: [
              {
                path: ':groupsId/timetables',
                module: TimeTablesFromGroupsModule.module,
              },
              {
                path: 'timetables/:timetablesId/appointments',
                module: AppointmentsModule.register(AppointmentsContext.TIMETABLES, TimeTablesContext.GROUPS).module,
              }
            ]
          },
          {
            path: ':institutionsId/presentators',
            module: PresentatorsModule,
            children: [
              {
                path: ':presentatorsId/appointments',
                module: AppointmentsModule.register(AppointmentsContext.PRESENTATORS).module,
              },
            ]
          },
          {
            path: ':institutionsId/subjects',
            module: SubjectsModule
          },
          {
            path: ':institutionsId/rooms',
            module: RoomsModule,
            children: [
              {
                path: ':roomsId/appointments',
                module: AppointmentsModule.register(AppointmentsContext.ROOMS).module,
              },
            ]
          },
          {
            path: ':institutionsId/timetables',
            module: TimeTablesFromInstitutionsModule.module,
            children: [
              {
                path: ':timetablesId/appointments',
              }
            ]
          },
          {
            path: ':institutionsId/users',
            module: UsersModule
          },
        ],
      },
    ]),
    InstitutionsModule,
    GroupsModule,
    TimeTablesFromGroupsModule,
    PresentatorsModule,
    SubjectsModule,
    RoomsModule,
    UsersModule,
    LoginModule,
    RegisterModule,
  ],
})
export class AppModule {}
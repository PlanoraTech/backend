import { Module } from '@nestjs/common';
import { InstitutionsModule } from './endpoints/institutions/institutions.module';
import { RouterModule } from '@nestjs/core';
import { AppointmentsModule } from './endpoints/appointments/appointments.module';
import { GroupsModule } from './endpoints/groups/groups.module';
import { PresentatorsModule } from './endpoints/presentators/presentators.module';
import { RoomsModule } from './endpoints/rooms/rooms.module';
import { SubjectsModule } from './endpoints/subjects/subjects.module';
import { TimeTablesModule } from './endpoints/timetables/timetables.module';
import { UsersModule } from './endpoints/users/users.module';
import { LoginModule } from './endpoints/auth/login/login.module';
import { RegisterModule } from './endpoints/auth/register/register.module';

@Module({
  imports: [
    InstitutionsModule,
    GroupsModule,
    PresentatorsModule,
    SubjectsModule,
    RoomsModule,
    TimeTablesModule,
    AppointmentsModule,
    UsersModule,
    LoginModule,
    RegisterModule,
    RouterModule.register([
      {
        path: 'institutions',
        module: InstitutionsModule,
        children: [
          {
            path: ':institutionsId/groups',
            module: GroupsModule
          },
          {
            path: ':institutionsId/presentators',
            module: PresentatorsModule
          },
          {
            path: ':institutionsId/subjects',
            module: SubjectsModule
          },
          {
            path: ':institutionsId/rooms',
            module: RoomsModule
          },
          {
            path: ':institutionsId/timetables',
            module: TimeTablesModule,
            children: [
              {
                path: ':timetablesId/appointments',
                module: AppointmentsModule,
              },
            ]
          },
          {
            path: ':institutionsId/users',
            module: UsersModule
          },
        ]
      },
      {
        path: 'login',
        module: LoginModule
      },
      {
        path: 'register',
        module: RegisterModule
      },
    ]),
  ],
})
export class AppModule { }

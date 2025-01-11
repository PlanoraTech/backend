import { Module } from '@nestjs/common';
import { InstitutionsModule } from './institutions/institutions.module';
import { RouterModule } from '@nestjs/core';
import { AppointmentsModule } from './appointments/appointments.module';
import { GroupsModule } from './groups/groups.module';
import { PresentatorsModule } from './presentators/presentators.module';
import { RoomsModule } from './rooms/rooms.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TimeTablesModule } from './timetables/timetables.module';
import { UsersModule } from './users/users.module';
import { LoginModule } from './auth/login/login.module';
import { RegisterModule } from './auth/register/register.module';

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
            path: ':institutionsId/login',
            module: LoginModule
          },
          {
            path: ':institutionsId/register',
            module: RegisterModule
          },
        ]
      }
    ]),
  ],
})
export class AppModule { }

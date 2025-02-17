import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { InstitutionsModule } from './endpoints/institutions/institutions.module';
import { PresentatorsModule } from './endpoints/presentators/presentators.module';
import { SubjectsModule } from './endpoints/subjects/subjects.module';
import { RoomsModule } from './endpoints/rooms/rooms.module';
import { TimeTablesModule } from './endpoints/timetables/timetables.module';
import { AppointmentsModule } from './endpoints/appointments/appointments.module';
import { UsersModule } from './endpoints/users/users.module';
import { LoginModule } from './endpoints/auth/login/login.module';
import { RegisterModule } from './endpoints/auth/register/register.module';
import { ProfileModule } from './endpoints/profile/profile.module';
import { EventsModule } from './endpoints/events/events.module';

@Module({
  imports: [
    InstitutionsModule,
    PresentatorsModule,
    SubjectsModule,
    RoomsModule,
    TimeTablesModule,
    EventsModule,
    AppointmentsModule,
    UsersModule,
    LoginModule,
    RegisterModule,
    ProfileModule,
    RouterModule.register([
      {
        path: 'institutions',
        module: InstitutionsModule,
        children: [
          {
            path: ':institutionId',
            module: PresentatorsModule,
          },
          {
            path: ':institutionId/subjects',
            module: SubjectsModule,
          },
          {
            path: ':institutionId',
            module: RoomsModule,
          },
          {
            path: ':institutionId/events',
            module: EventsModule,
          },
          {
            path: ':institutionId/timetables',
            module: TimeTablesModule,
          },
          {
            path: ':institutionId/users',
            module: UsersModule,
          },
        ]
      }
    ]),
  ],
})
export class AppModule { }
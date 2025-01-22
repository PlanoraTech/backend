import { Module } from '@nestjs/common';
import { InstitutionsModule } from './endpoints/institutions/institutions.module';
import { GroupsModule } from './endpoints/groups/groups.module';
import { PresentatorsModule } from './endpoints/presentators/presentators.module';
import { SubjectsModule } from './endpoints/subjects/subjects.module';
import { RoomsModule } from './endpoints/rooms/rooms.module';
import { TimeTablesModule } from './endpoints/timetables/timetables.module';
import { AppointmentsModule } from './endpoints/appointments/appointments.module';
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
  ],
})
export class AppModule { }

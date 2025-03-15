import { Module } from '@nestjs/common';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { PrismaService } from './prisma/prisma.service';
import { SecretService } from './auth/secret/secret.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthGuard } from './guards/auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { InstitutionsModule } from './endpoints/institutions/institutions.module';
import { PresentatorsModule } from './endpoints/presentators/presentators.module';
import { SubjectsModule } from './endpoints/subjects/subjects.module';
import { RoomsModule } from './endpoints/rooms/rooms.module';
import { TimeTablesModule } from './endpoints/timetables/timetables.module';
import { EventsModule } from './endpoints/events/events.module';
import { AppointmentsModule } from './endpoints/appointments/appointments.module';
import { UsersModule } from './endpoints/users/users.module';
import { RegisterModule } from './endpoints/register/register.module';
import { LoginModule } from './endpoints/login/login.module';
import { LogoutModule } from './endpoints/logout/logout.module';
import { ProfileModule } from './endpoints/profile/profile.module';

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
    RegisterModule,
    LoginModule,
    LogoutModule,
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
            path: ':institutionId',
            module: TimeTablesModule,
          },
          {
            path: ':institutionId/users',
            module: UsersModule,
          },
        ]
      }
    ]),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    SecretService,
    PrismaService,
  ],
})
export class AppModule { }
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

@Module({
  imports: [
    InstitutionsModule,
    GroupsModule,
    PresentatorsModule,
    SubjectsModule,
    RoomsModule,
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
            module: GroupsModule,
          },
          /*
          {
            path: ':institutionsId/presentators',
            module: PresentatorsModule,
            children: [
              {
                path: ':presentatorsId/appointments',
                module: AppointmentsModule.forRoot(AppointmentsContext.PRESENTATORS).module,
              },
            ]
          },
          */
          {
            path: ':institutionsId/subjects',
            module: SubjectsModule
          },
          /*
          {
            path: ':institutionsId/rooms',
            module: RoomsModule,
            children: [
              {
                path: ':roomsId/appointments',
                module: AppointmentsModule.forRoot(AppointmentsContext.ROOMS).module,
                children: [
                  {
                    path: ':appointmentsId/presentators',
                    module: PresentatorsModule,
                  },
                ]
              },
            ]
          },
          */
          {
            path: ':institutionsId/users',
            module: UsersModule
          },
        ],
      },
    ]),
  ],
})
export class AppModule {}
import { DynamicModule, Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from 'src/institutions/institutions.service';
import { PresentatorsService } from 'src/presentators/presentators.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { TimeTablesService } from 'src/timetables/timetables.service';
import { TimeTablesContext, TimeTablesModule } from 'src/timetables/timetables.module';

export enum AppointmentsContext {
  TIMETABLES,
  PRESENTATORS,
  ROOMS,
}

@Module({})
export class AppointmentsModule {
  static register(context: AppointmentsContext, timetablesContext?: TimeTablesContext): DynamicModule {
    function AppointmentsServiceContext(context: AppointmentsContext) {
      switch (context) {
        case AppointmentsContext.TIMETABLES:
          if (timetablesContext) return TimeTablesService;
          throw new Error('timetablesContext is required for TIMETABLES context');
        case AppointmentsContext.PRESENTATORS:
          return PresentatorsService;
        case AppointmentsContext.ROOMS:
          return RoomsService;
        default:
          throw new Error(`Invalid context: ${context}`);
      }
    }
    return {
      module: AppointmentsModule,
      imports: (timetablesContext) ? [TimeTablesModule.register(timetablesContext)] : undefined,
      controllers: [AppointmentsController],
      providers: [AppointmentsService, InstitutionsService, PrismaClient,
        {
          provide: 'AppointmentsDataService',
          useClass: AppointmentsServiceContext(context),
        }
      ],
    };
  }
}

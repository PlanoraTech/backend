import { DynamicModule, forwardRef, Module, Provider } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from 'src/institutions/institutions.service';
import { PresentatorsService } from 'src/presentators/presentators.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { TimeTablesService } from 'src/timetables/timetables.service';
import { TimeTablesContext, TimeTablesModule } from 'src/timetables/timetables.module';
import { TimeTablesDataService } from 'src/timetables/timetablesdata.service';
import { AppointmentsDataService } from './appointmentsdata.service';

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
        case AppointmentsContext.TIMETABLES && timetablesContext: return TimeTablesService;
        case AppointmentsContext.PRESENTATORS: return PresentatorsService;
        case AppointmentsContext.ROOMS: return RoomsService
      }
    }
    return {
      module: AppointmentsModule,
      imports: [forwardRef(() => TimeTablesModule.register(timetablesContext))],
      controllers: [AppointmentsController],
      providers: [AppointmentsService, InstitutionsService, PrismaClient,
        {
          provide: AppointmentsDataService,
          useClass: AppointmentsServiceContext(context),
        }
      ],
      exports: [AppointmentsService],
    };
  }
}

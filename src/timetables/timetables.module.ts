import { DynamicModule, forwardRef, Module } from '@nestjs/common';
import { TimeTablesController } from './timetables.controller';
import { PrismaClient } from '@prisma/client';
import { TimeTablesService } from './timetables.service';
import { InstitutionsService } from 'src/institutions/institutions.service';
import { GroupsService } from 'src/groups/groups.service';
import { TimeTablesDataService } from './timetablesdata.service';

export enum TimeTablesContext {
  INSTITUTIONS,
  GROUPS,
}

@Module({})
export class TimeTablesModule {
  static register(context: TimeTablesContext): DynamicModule {
    function TimeTablesServiceContext(context: TimeTablesContext) {
      switch (context) {
        case TimeTablesContext.GROUPS: return GroupsService;
        case TimeTablesContext.INSTITUTIONS: return InstitutionsService;
      }
    }
    return {
      module: TimeTablesModule,
      controllers: [TimeTablesController],
      providers: [TimeTablesService, InstitutionsService, PrismaClient,
        {
          provide: TimeTablesDataService,
          useClass: TimeTablesServiceContext(context),
        },
      ],
      exports: [TimeTablesService],
    };
  }
}
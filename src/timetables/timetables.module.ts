import { Module } from '@nestjs/common';
import { TimeTablesService } from './timetables.service';
import { TimeTablesController } from './timetables.controller';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from 'src/institutions/institutions.service';

@Module({
  controllers: [TimeTablesController],
  providers: [TimeTablesService, InstitutionsService, PrismaClient],
})
export class TimeTablesModule {}

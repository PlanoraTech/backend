import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import {
  TimeTablesFromAppointmentsService,
  TimeTablesService,
} from './timetables.service';
import {
  TimeTablesController,
  TimeTablesFromAppointmentsController,
} from './timetables.controller';

@Module({
  controllers: [TimeTablesFromAppointmentsController, TimeTablesController],
  providers: [
    TimeTablesFromAppointmentsService,
    TimeTablesService,
    PrismaService,
  ],
})
export class TimeTablesModule {}

import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from 'src/institutions/institutions.service';
import { TimeTablesService } from 'src/timetables/timetables.service';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, TimeTablesService, InstitutionsService, PrismaClient],
})
export class AppointmentsModule {}

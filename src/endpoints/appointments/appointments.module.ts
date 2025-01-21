import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from 'src/endpoints/institutions/institutions.service';
import { TimeTablesService } from 'src/endpoints/timetables/timetables.service';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, TimeTablesService, InstitutionsService, PrismaClient],
})
export class AppointmentsModule {}

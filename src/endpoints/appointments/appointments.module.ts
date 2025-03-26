import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import {
  AppointmentsFromTimeTablesService,
  AppointmentsService,
} from './appointments.service';
import {
  AppointmentsController,
  AppointmentsFromTimeTablesController,
} from './appointments.controller';

@Module({
  controllers: [AppointmentsFromTimeTablesController, AppointmentsController],
  providers: [
    AppointmentsFromTimeTablesService,
    AppointmentsService,
    PrismaService,
  ],
})
export class AppointmentsModule {}

import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AppointmentsFromTimeTablesService, AppointmentsService } from './appointments.service';
import { AppointmentsController, AppointmentsFromTimeTablesController } from './appointments.controller';

@Module({
	controllers: [AppointmentsFromTimeTablesController, AppointmentsController],
	providers: [AppointmentsFromTimeTablesService, AppointmentsService, PrismaClient],
})
export class AppointmentsModule { }
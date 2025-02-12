import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PresentatorsFromAppointmentsService, PresentatorsService } from './presentators.service';
import { PresentatorsController, PresentatorsFromAppointmentsController } from './presentators.controller';

@Module({
	controllers: [PresentatorsFromAppointmentsController, PresentatorsController],
	providers: [PresentatorsFromAppointmentsService, PresentatorsService, PrismaClient],
})
export class PresentatorsModule { }
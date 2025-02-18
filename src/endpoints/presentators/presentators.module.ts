import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { PresentatorsFromAppointmentsService, PresentatorsService } from './presentators.service';
import { PresentatorsController, PresentatorsFromAppointmentsController } from './presentators.controller';

@Module({
	controllers: [PresentatorsFromAppointmentsController, PresentatorsController],
	providers: [PresentatorsFromAppointmentsService, PresentatorsService, PrismaService],
})
export class PresentatorsModule { }
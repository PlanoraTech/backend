import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RoomsFromAppointmentsService, RoomsService } from './rooms.service';
import { RoomsController, RoomsFromAppointmentsController } from './rooms.controller';

@Module({
	controllers: [RoomsFromAppointmentsController, RoomsController],
	providers: [RoomsFromAppointmentsService, RoomsService, PrismaClient],
})
export class RoomsModule { }
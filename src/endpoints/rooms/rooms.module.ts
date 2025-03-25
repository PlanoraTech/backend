import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { RoomsFromAppointmentsService, RoomsService } from './rooms.service';
import {
  RoomsController,
  RoomsFromAppointmentsController,
} from './rooms.controller';

@Module({
  controllers: [RoomsFromAppointmentsController, RoomsController],
  providers: [RoomsFromAppointmentsService, RoomsService, PrismaService],
})
export class RoomsModule {}

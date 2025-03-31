import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { RoomsFromAppointmentsService, RoomsService } from './rooms.service';
import {
    RoomsController,
    RoomsFromAppointmentsController,
} from './rooms.controller';
import { PushNotificationsService } from '@app/push-notifications/push-notifications.service';

@Module({
    imports: [HttpModule],
    controllers: [RoomsFromAppointmentsController, RoomsController],
    providers: [
        RoomsFromAppointmentsService,
        RoomsService,
        PushNotificationsService,
        PrismaService,
    ],
})
export class RoomsModule {}

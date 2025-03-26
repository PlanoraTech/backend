import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { PushNotificationsService } from '@app/push-notifications/push-notifications.service';
import {
    PresentatorsFromAppointmentsService,
    PresentatorsService,
} from './presentators.service';
import {
    PresentatorsController,
    PresentatorsFromAppointmentsController,
} from './presentators.controller';

@Module({
    imports: [HttpModule],
    controllers: [
        PresentatorsFromAppointmentsController,
        PresentatorsController,
    ],
    providers: [
        PresentatorsFromAppointmentsService,
        PresentatorsService,
        PushNotificationsService,
        PrismaService,
    ],
})
export class PresentatorsModule {}

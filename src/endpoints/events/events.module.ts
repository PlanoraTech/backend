import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
	controllers: [EventsController],
	providers: [EventsService, PrismaClient],
})
export class EventsModule { }
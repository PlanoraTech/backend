import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
	controllers: [EventsController],
	providers: [EventsService, PrismaService],
})
export class EventsModule { }
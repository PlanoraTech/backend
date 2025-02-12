import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TimeTablesService } from './timetables.service';
import { TimeTablesController } from './timetables.controller';

@Module({
	controllers: [TimeTablesController],
	providers: [TimeTablesService, PrismaClient],
})
export class TimeTablesModule { }
import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TimeTablesService } from './timetables.service';
import { TimeTablesController } from './timetables.controller';

@Module({
	controllers: [TimeTablesController],
	providers: [TimeTablesService, PrismaService],
})
export class TimeTablesModule { }
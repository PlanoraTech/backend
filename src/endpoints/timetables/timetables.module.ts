import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from 'src/endpoints/institutions/institutions.service';
import { TimeTablesService } from './timetables.service';
import { TimeTablesController } from './timetables.controller';

@Module({
	controllers: [TimeTablesController],
	providers: [TimeTablesService, InstitutionsService, PrismaClient],
})
export class TimeTablesModule { }
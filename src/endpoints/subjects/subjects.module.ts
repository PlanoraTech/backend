import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';

@Module({
	controllers: [SubjectsController],
	providers: [SubjectsService, PrismaClient],
})
export class SubjectsModule { }
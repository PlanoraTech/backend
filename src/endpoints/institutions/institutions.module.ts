import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from './institutions.service';
import { InstitutionsController } from './institutions.controller';

@Module({
	controllers: [InstitutionsController],
	providers: [InstitutionsService, PrismaClient],
})
export class InstitutionsModule { }
import { Module } from '@nestjs/common';
import { PresentatorsService } from './presentators.service';
import { PresentatorsController } from './presentators.controller';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from 'src/endpoints/institutions/institutions.service';

@Module({
	controllers: [PresentatorsController],
	providers: [PresentatorsService, InstitutionsService, PrismaClient],
})
export class PresentatorsModule { }
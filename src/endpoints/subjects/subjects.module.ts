import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from 'src/endpoints/institutions/institutions.service';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService, InstitutionsService, PrismaClient],
})
export class SubjectsModule {}

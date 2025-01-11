import { Module } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { InstitutionsController } from './institutions.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [InstitutionsController],
  providers: [InstitutionsService, PrismaClient],
  exports: [InstitutionsService],
})
export class InstitutionsModule {}

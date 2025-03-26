import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { InstitutionsService } from './institutions.service';
import { InstitutionsController } from './institutions.controller';

@Module({
  controllers: [InstitutionsController],
  providers: [InstitutionsService, PrismaService],
})
export class InstitutionsModule {}

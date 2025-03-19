import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { SubstitutionsService } from './substitutions.service';
import { SubstitutionsController } from './substitutions.controller';

@Module({
  controllers: [SubstitutionsController],
  providers: [SubstitutionsService, PrismaService],
})
export class SubstitutionsModule {}

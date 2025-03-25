import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService, PrismaService],
})
export class SubjectsModule {}

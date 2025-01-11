import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { InstitutionsService } from 'src/institutions/institutions.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService, InstitutionsService, PrismaClient],
})
export class GroupsModule {}

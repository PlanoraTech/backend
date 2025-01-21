import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from 'src/endpoints/institutions/institutions.service';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService, InstitutionsService, PrismaClient],
})
export class GroupsModule {}

import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, PrismaClient],
})
export class ProfileModule {}

import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, PrismaClient],
})
export class ProfileModule {}

import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, PrismaService],
})
export class ProfileModule {}
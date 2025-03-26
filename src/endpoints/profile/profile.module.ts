import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { SecretService } from '@app/auth/secret/secret.service';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

@Module({
    controllers: [ProfileController],
    providers: [ProfileService, SecretService, PrismaService],
})
export class ProfileModule {}

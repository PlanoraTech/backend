import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { SecretService } from '@app/auth/secret/secret.service';
import { LogoutService } from './logout.service';
import { LogoutController } from './logout.controller';

@Module({
	controllers: [LogoutController],
	providers: [LogoutService, SecretService, PrismaService],
})
export class LogoutModule { }
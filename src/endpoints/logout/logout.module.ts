import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { LogoutService } from './logout.service';
import { LogoutController } from './logout.controller';

@Module({
	controllers: [LogoutController],
	providers: [LogoutService, PrismaService],
})
export class LogoutModule { }
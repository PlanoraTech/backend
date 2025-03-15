import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { SecretService } from '@app/auth/secret/secret.service';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
	controllers: [UsersController],
	providers: [UsersService, SecretService, PrismaService],
})
export class UsersModule { }
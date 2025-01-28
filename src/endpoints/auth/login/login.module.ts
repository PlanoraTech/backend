import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [LoginController],
  providers: [LoginService, PrismaClient],
})
export class LoginModule {}

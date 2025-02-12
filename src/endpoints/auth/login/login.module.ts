import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';

@Module({
  controllers: [LoginController],
  providers: [LoginService, PrismaClient],
})
export class LoginModule {}

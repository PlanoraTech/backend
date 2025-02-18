import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';

@Module({
  controllers: [LoginController],
  providers: [LoginService, PrismaService],
})
export class LoginModule {}
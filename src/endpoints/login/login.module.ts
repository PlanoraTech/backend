import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { SecretService } from '@app/auth/secret/secret.service';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';

@Module({
  controllers: [LoginController],
  providers: [LoginService, SecretService, PrismaService],
})
export class LoginModule {}
import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { SecretService } from '@app/auth/secret/secret.service';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService, SecretService, PrismaService],
})
export class RegisterModule {}

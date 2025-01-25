import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService, PrismaClient],
})
export class RegisterModule {}

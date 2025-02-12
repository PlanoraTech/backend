import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService, PrismaClient],
})
export class RegisterModule {}

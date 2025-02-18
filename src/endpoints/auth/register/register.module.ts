import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService, PrismaService],
})
export class RegisterModule {}
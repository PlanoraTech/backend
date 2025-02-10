import { Controller, Post, Body, Query } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterDto } from './dto/register.dto';
import { Tokens } from '@prisma/client';
import { TokenExpiry } from '../secret/secret.service';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  create(@Body() registerDto: RegisterDto, @Query('expiry') expiry?: string): Promise<Partial<Tokens>> {
    return this.registerService.create(registerDto, TokenExpiry[expiry as keyof typeof TokenExpiry]);
  }
}

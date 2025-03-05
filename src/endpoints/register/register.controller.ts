import { Controller, Post, Body, Query } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterDto } from './dto/register.dto';
import { TokenExpiry } from '@app/auth/secret/secret.service';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  create(@Body() registerDto: RegisterDto, @Query('expiry') expiry?: string): Promise<{ token: string; expiry: Date; }> {
    return this.registerService.create(registerDto, TokenExpiry[expiry as keyof typeof TokenExpiry]);
  }
}

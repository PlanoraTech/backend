import { Controller, Post, Body, Query } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterDto } from './dto/register.dto';
import { TokenExpiry } from '@app/auth/secret/secret.service';
import { Access } from '@app/decorators/access.decorator';
import { AccessType } from '@prisma/client';
import { Permissions } from '@app/decorators/permissions.decorator';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) { }

  @Post()
  @Access(AccessType.PUBLIC)
  @Permissions([])
  create(@Body() registerDto: RegisterDto, @Query('expiry') expiry?: string): Promise<{ token: string; expiry: Date; }> {
    return this.registerService.create(registerDto, TokenExpiry[expiry as keyof typeof TokenExpiry]);
  }
}

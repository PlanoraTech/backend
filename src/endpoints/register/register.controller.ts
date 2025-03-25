import { Controller, Post, Body } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterDto } from './dto/register.dto';
import { Access } from '@app/decorators/access.decorator';
import { AccessType } from '@prisma/client';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  @Access(AccessType.PUBLIC)
  create(@Body() registerDto: RegisterDto): Promise<{ token: string }> {
    return this.registerService.create(registerDto);
  }
}

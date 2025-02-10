import { Controller, Post, Body, Query } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';
import { ExtendedLogin } from './types/login.type';
import { TokenExpiry } from '../secret/secret.service';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  login(@Body() loginDto: LoginDto, @Query('expiry') expiry?: string): Promise<Partial<ExtendedLogin>> {
    return (loginDto.token) ? this.loginService.loginByToken(loginDto.token) : this.loginService.loginByEmailAndPassword(loginDto.email, loginDto.password, TokenExpiry[expiry as keyof typeof TokenExpiry]);
  }
}

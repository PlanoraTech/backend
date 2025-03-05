import { Controller, Post, Body, Query } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';
import { Login } from './interfaces/Login';
import { TokenExpiry } from '@app/auth/secret/secret.service';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  login(@Body() loginDto: LoginDto, @Query('expiry') expiry?: string): Promise<Partial<Login>> {
    return (loginDto.token) ? this.loginService.loginByToken(loginDto.token) : this.loginService.loginByEmailAndPassword(loginDto.email as string, loginDto.password as string, TokenExpiry[expiry as keyof typeof TokenExpiry]);
  }
}

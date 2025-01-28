import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  login(@Body() loginDto: LoginDto) {
    return (loginDto.token) ? this.loginService.loginByToken(loginDto.token) : this.loginService.loginByEmailAndPassword(loginDto.email, loginDto.password);
  }
}

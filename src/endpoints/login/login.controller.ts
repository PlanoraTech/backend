import { Controller, Post, Body, HttpCode, Req } from '@nestjs/common';
import { AccessType } from '@prisma/client';
import { LoginService } from './login.service';
import { Access } from '@app/decorators/access.decorator';
import { LoginDto } from './dto/login.dto';
import { Login } from './interfaces/Login';
import { User } from '@app/interfaces/User.interface';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  @HttpCode(200)
  @Access(AccessType.PUBLIC)
  login(@Body() loginDto: LoginDto): Promise<Login> {
    return this.loginService.loginByEmailAndPassword(loginDto);
  }

  @Post('auto')
  @HttpCode(200)
  autologin(@Req() req: Request & { user: User }): Login {
    return {
      user: {
        institutions: req.user.institutions,
      },
    };
  }
}

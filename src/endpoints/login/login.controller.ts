import { Controller, Post, Body, HttpCode, Req } from '@nestjs/common';
import {
    ApiTags,
    ApiOkResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessType } from '@prisma/client';
import { LoginService } from './login.service';
import { Access } from '@app/decorators/access.decorator';
import { LoginDto } from './dto/login.dto';
import { Login } from './interfaces/login.interface';
import { User } from '@app/interfaces/user';

@ApiTags('Login')
@Controller('login')
export class LoginController {
    constructor(private readonly loginService: LoginService) {}

    /**
     * Authenticate a user using email and password
     *
     * @remarks This operation validates the provided credentials and returns authentication details.
     */
    @Post()
    @HttpCode(200)
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({ description: 'Successfully authenticated the user.' })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized. Invalid email or password.',
    })
    login(@Body() loginDto: LoginDto): Promise<Login> {
        return this.loginService.loginByEmailAndPassword(loginDto);
    }

    /**
     * Automatically authenticate a user based on the request session
     *
     * @remarks This operation retrieves the authenticated user details from the session.
     */
    @Post('auto')
    @HttpCode(200)
    @ApiOkResponse({
        description: 'Successfully retrieved the authenticated user.',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized. No valid session found.',
    })
    autologin(@Req() req: Request & { user: User }): Login {
        return {
            user: {
                institutions: req.user.institutions,
            },
        };
    }
}

import { Controller, HttpCode, Post, Req } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOkResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LogoutService } from './logout.service';
import { User } from '@app/interfaces/User.interface';

@ApiTags('Logout')
@ApiBearerAuth()
@Controller('logout')
export class LogoutController {
    constructor(private readonly logoutService: LogoutService) {}

    /**
     * Log out the current user session
     *
     * @remarks This operation logs out the user by invalidating the provided token.
     */
    @Post()
    @HttpCode(200)
    @ApiOkResponse({ description: 'Successfully logged out.' })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized. Invalid or missing token.',
    })
    logout(@Req() req: Request & { token: string }): Promise<void> {
        return this.logoutService.logout(req.token);
    }

    /**
     * Log out the user from all sessions globally
     *
     * @remarks This operation invalidates all active sessions of the user.
     */
    @Post('all')
    @HttpCode(200)
    @ApiOkResponse({
        description: 'Successfully logged out from all sessions.',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized. No valid session found.',
    })
    logoutGlobally(@Req() req: Request & { user: User }): Promise<void> {
        return this.logoutService.logoutGlobally(req.user.id);
    }
}

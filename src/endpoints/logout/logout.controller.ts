import { Controller, Headers, HttpCode, Post, Query, Req } from '@nestjs/common';
import { LogoutService } from './logout.service';
import { Permissions } from '@app/decorators/permissions.decorator';
import { User } from '@app/interfaces/User.interface';

@Controller('logout')
export class LogoutController {
	constructor(private readonly logoutService: LogoutService) { }

	@Post()
	@HttpCode(200)
	@Permissions([])
	logout(@Headers('Authorization') token: string, @Query('token') queryToken: string) {
		return this.logoutService.logout(token ?? queryToken);
	}

	@Post('all')
	@HttpCode(200)
	@Permissions([])
	logoutGlobally(@Req() req: (Request & { user: User })) {
		return this.logoutService.logoutGlobally(req.user.id);
	}
}
import { Controller, HttpCode, Post, Req } from '@nestjs/common';
import { LogoutService } from './logout.service';
import { User } from '@app/interfaces/User.interface';

@Controller('logout')
export class LogoutController {
	constructor(private readonly logoutService: LogoutService) { }

	@Post()
	@HttpCode(200)
	logout(@Req() req: (Request & { token: string })) {
		return this.logoutService.logout(req.token);
	}

	@Post('all')
	@HttpCode(200)
	logoutGlobally(@Req() req: (Request & { user: User })) {
		return this.logoutService.logoutGlobally(req.user.id);
	}
}
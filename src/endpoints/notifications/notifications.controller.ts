import { Controller, Post, Body, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from '@app/interfaces/User.interface';

@Controller('notifications')
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) { }

	@Post()
	create(@Req() req: (Request & { user: User }), @Body() createNotificationDto: CreateNotificationDto) {
		return this.notificationsService.create(req.user.id, createNotificationDto);
	}
}
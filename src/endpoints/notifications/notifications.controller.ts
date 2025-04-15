import { Controller, Post, Body, Req } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiUnauthorizedResponse,
    ApiCreatedResponse,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from '@app/interfaces/user.interface';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    /**
     * Create a new notification
     *
     * @remarks This operation creates a notification for the authenticated user.
     */
    @Post()
    @ApiCreatedResponse({
        description: 'Notification token successfully assigned to user.',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized. User not authenticated.',
    })
    create(
        @Req() req: Request & { user: User },
        @Body() createNotificationDto: CreateNotificationDto,
    ): Promise<void> {
        return this.notificationsService.create(
            req.user.id,
            createNotificationDto,
        );
    }
}

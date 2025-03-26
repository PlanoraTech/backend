import { Controller, Get, Body, Patch, Delete, Req } from '@nestjs/common';
import { Users } from '@prisma/client';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '@app/interfaces/User.interface';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get()
    get(@Req() req: Request & { user: User }): Promise<Partial<Users>> {
        return this.profileService.get(req.user.id);
    }

    @Patch()
    update(
        @Req() req: Request & { user: User },
        @Body() updateProfileDto: UpdateProfileDto,
    ): Promise<void> {
        return this.profileService.updatePassword(
            req.user.id,
            updateProfileDto,
        );
    }

    @Delete()
    remove(@Req() req: Request & { user: User }): Promise<void> {
        return this.profileService.remove(req.user.id);
    }
}

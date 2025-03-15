import { Controller, Get, Body, Patch, Delete, Req } from '@nestjs/common';
import { Users } from '@prisma/client';
import { ProfileService } from './profile.service';
import { Permissions } from '@app/decorators/permissions.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '@app/interfaces/User.interface';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Get()
  @Permissions([])
  get(@Req() req: (Request & { user: User })): Promise<Partial<Users>> {
    return this.profileService.get(req.user.id);
  }

  @Patch()
  @Permissions([])
  update(@Req() req: (Request & { user: User }), @Body() updateProfileDto: UpdateProfileDto): Promise<void> {
    return this.profileService.updatePassword(req.user.id, updateProfileDto);
  }

  @Delete()
  @Permissions([])
  remove(@Req() req: (Request & { user: User })): Promise<void> {
    return this.profileService.remove(req.user.id);
  }
}

import { Controller, Get, Body, Patch, Delete, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Users } from '@prisma/client';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  get(@Query('token') token: string): Promise<Partial<Users>> {
    return this.profileService.get(token);
  }

  @Patch()
  update(@Query('token') token: string, @Body() updateProfileDto: UpdateProfileDto): Promise<void> {
    return this.profileService.updatePassword(token, updateProfileDto);
  }

  @Delete()
  remove(@Query('token') token: string): Promise<void> {
    return this.profileService.remove(token);
  }
}

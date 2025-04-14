import { Controller, Get, Body, Patch, Delete, Req } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOkResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '@app/interfaces/user.interface';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    /**
     * Retrieve the profile of the currently authenticated user.
     *
     * @remarks This operation retrieves the details of the currently authenticated user's profile.
     */
    @Get()
    @ApiOkResponse({ description: 'Successfully retrieved the profile.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access this profile.',
    })
    get(@Req() req: Request & { user: User }): Promise<Partial<Users>> {
        return this.profileService.get(req.user.id);
    }

    /**
     * Update the profile of the currently authenticated user.
     *
     * @remarks This operation allows the currently authenticated user to update their profile information, including their password.
     */
    @Patch()
    @ApiOkResponse({ description: 'Successfully updated the profile.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to update this profile.',
    })
    update(
        @Req() req: Request & { user: User },
        @Body() updateProfileDto: UpdateProfileDto,
    ): Promise<void> {
        return this.profileService.updatePassword(
            req.user.id,
            updateProfileDto,
        );
    }

    /**
     * Delete the profile of the currently authenticated user.
     *
     * @remarks This operation deletes the profile of the currently authenticated user.
     */
    @Delete()
    @ApiOkResponse({ description: 'Successfully deleted the profile.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to delete this profile.',
    })
    @ApiNotFoundResponse({
        description: 'Profile not found with the given ID.',
    })
    remove(@Req() req: Request & { user: User }): Promise<void> {
        return this.profileService.remove(req.user.id);
    }
}

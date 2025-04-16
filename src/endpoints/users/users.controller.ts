import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOkResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { usersSelect, UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * Assing a user to an institution.
     *
     * @remarks This endpoint assigns a new user to the given institution.
     */
    @Post()
    @ApiOkResponse({ description: 'Successfully assigned the user.' })
    @ApiForbiddenResponse({
        description: 'Forbidden. You do not have permission to create a user.',
    })
    add(
        @Param('institutionId') institutionId: string,
        @Body() userDto: UserDto,
    ): Promise<void> {
        return this.usersService.add(institutionId, userDto);
    }

    /**
     * Retrieve all users in the given institution.
     *
     * @remarks This endpoint fetches all users in the specified institution.
     */
    @Get()
    @ApiOkResponse({ description: 'Successfully retrieved all users.' })
    @ApiForbiddenResponse({
        description: 'Forbidden. You do not have permission to view users.',
    })
    findAll(@Param('institutionId') institutionId: string): Promise<
        Prisma.UsersGetPayload<{
            select: typeof usersSelect;
        }>[]
    > {
        return this.usersService.findAll(institutionId);
    }

    /**
     * Remove a user by ID from an institution.
     *
     * @remarks This endpoint removes a user with the given ID from the specified institution.
     */
    @Delete(':id')
    @ApiOkResponse({ description: 'Successfully removed the user.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to remove this user.',
    })
    @ApiNotFoundResponse({ description: 'User not found with the given ID.' })
    remove(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.usersService.remove(institutionId, id);
    }
}

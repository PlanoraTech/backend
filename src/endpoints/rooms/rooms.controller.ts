import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseArrayPipe,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOkResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
    AccessType,
    Permissions,
    Rooms,
    SpecialPermissions,
} from '@prisma/client';
import { RoomsFromAppointmentsService, RoomsService } from './rooms.service';
import { Access } from '@app/decorators/access.decorator';
import { Permission } from '@app/decorators/permission.decorator';
import { SpecialPermission } from '@app/decorators/specialPermission.decorator';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UpdateMassDto } from '@app/dto/update-mass.dto';

@ApiTags('Rooms')
@ApiBearerAuth()
@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    /**
     * Create a new room.
     *
     * @remarks This operation creates a new room under a specified institution.
     */
    @Post()
    @ApiOkResponse({ description: 'Successfully created the room.' })
    @ApiForbiddenResponse({
        description: 'Forbidden. You do not have permission to create a room.',
    })
    create(
        @Param('institutionId') institutionId: string,
        @Body() createRoomDto: CreateRoomDto,
    ): Promise<void> {
        return this.roomsService.create(institutionId, createRoomDto);
    }

    /**
     * Retrieve all rooms for a given institution.
     *
     * @remarks This operation fetches all rooms associated with a specific institution.
     */
    @Get()
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({ description: 'Successfully retrieved all rooms.' })
    @ApiForbiddenResponse({
        description: 'Forbidden. You do not have permission to access rooms.',
    })
    findAll(@Param('institutionId') institutionId: string): Promise<Rooms[]> {
        return this.roomsService.findAll(institutionId);
    }

    /**
     * Retrieve a specific room by ID.
     *
     * @remarks This operation fetches details of a particular room.
     */
    @Get(':id')
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({ description: 'Successfully retrieved the room.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access this room.',
    })
    @ApiNotFoundResponse({ description: 'Room not found with the given ID.' })
    findOne(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
    ): Promise<Rooms> {
        return this.roomsService.findOne(institutionId, id);
    }

    /**
     * Update a room's details.
     *
     * @remarks This operation updates the details of a specific room.
     */
    @Patch(':id')
    @ApiOkResponse({ description: 'Successfully updated the room.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to update this room.',
    })
    @ApiNotFoundResponse({ description: 'Room not found with the given ID.' })
    update(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
        @Body() updateRoomDto: UpdateRoomDto,
    ): Promise<void> {
        return this.roomsService.update(institutionId, id, updateRoomDto);
    }

    /**
     * Remove a room.
     *
     * @remarks This operation deletes a specific room.
     */
    @Delete(':id')
    @ApiOkResponse({ description: 'Successfully removed the room.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to remove this room.',
    })
    @ApiNotFoundResponse({ description: 'Room not found with the given ID.' })
    remove(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.roomsService.remove(institutionId, id);
    }
}

@ApiTags('Rooms')
@ApiBearerAuth()
@Controller([
    'timetables/:timetableId/appointments/:appointmentId/rooms',
    'presentators/:presentatorId/appointments/:appointmentId/rooms',
    'rooms/:roomId/appointments/:appointmentId/rooms',
])
export class RoomsFromAppointmentsController {
    constructor(private readonly roomsService: RoomsFromAppointmentsService) {}

    /**
     * Add a room to an appointment.
     *
     * @remarks This operation assigns a room to a specific appointment.
     */
    @Post(':id')
    @ApiOkResponse({
        description: 'Successfully added the room to the appointment.',
    })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to add a room to this appointment.',
    })
    add(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.roomsService.add(
            institutionId,
            {
                timetableId: timetableId,
                presentatorId: presentatorId,
                roomId: roomId,
                appointmentId: appointmentId,
            },
            id,
        );
    }

    /**
     * Retrieve all rooms for a given appointment.
     *
     * @remarks This operation fetches all rooms associated with a specific appointment.
     */
    @Get()
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({
        description: 'Successfully retrieved all rooms for the appointment.',
    })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access rooms for this appointment.',
    })
    findAll(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
    ): Promise<Rooms[]> {
        return this.roomsService.findAll(institutionId, {
            timetableId: timetableId,
            presentatorId: presentatorId,
            roomId: roomId,
            appointmentId: appointmentId,
        });
    }

    /**
     * Retrieves a list of available rooms for a given timetable and appointment.
     *
     * @remarks This operation checks for rooms that are currently unoccupied during
     * the specified appointment time. It allows users to find alternative rooms
     * based on scheduling constraints.
     */
    @Get('available')
    @Permission([Permissions.READ])
    @SpecialPermission([SpecialPermissions.CHANGE_ROOM])
    @ApiOkResponse({ description: 'Successfully retrieved available rooms.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access available rooms.',
    })
    @ApiNotFoundResponse({
        description: 'No available rooms found for the given parameters.',
    })
    findAvailableRooms(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
    ): Promise<Rooms[]> {
        return this.roomsService.findAvailableRooms(institutionId, {
            timetableId: timetableId,
            presentatorId: presentatorId,
            roomId: roomId,
            appointmentId: appointmentId,
        });
    }

    /**
     * Retrieve a specific room assigned to an appointment.
     *
     * @remarks This operation fetches a specific room assigned to an appointment.
     */
    @Get(':id')
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({
        description: 'Successfully retrieved the room for the appointment.',
    })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access this room for the appointment.',
    })
    @ApiNotFoundResponse({
        description: 'Room not found with the given ID for this appointment.',
    })
    findOne(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
        @Param('id') id: string,
    ): Promise<Rooms> {
        return this.roomsService.findOne(
            institutionId,
            {
                timetableId: timetableId,
                presentatorId: presentatorId,
                roomId: roomId,
                appointmentId: appointmentId,
            },
            id,
        );
    }

    /**
     * Updates multiple room assignments for a given timetable and appointment.
     *
     * @remarks This operation modifies room assignments based on the provided update data.
     */
    @Patch()
    @Permission([Permissions.READ])
    @SpecialPermission([SpecialPermissions.CHANGE_ROOM])
    @ApiOkResponse({ description: 'Successfully updated the rooms.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to update the rooms.',
    })
    @ApiNotFoundResponse({
        description: 'One or more rooms not found with the given identifiers.',
    })
    @ApiBadRequestResponse({ description: 'Invalid input data.' })
    update(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
        @Body(
            new ParseArrayPipe({
                items: UpdateMassDto,
                forbidNonWhitelisted: true,
            }),
        )
        updateMassDto: UpdateMassDto[],
    ): Promise<void> {
        return this.roomsService.update(
            institutionId,
            {
                timetableId: timetableId,
                presentatorId: presentatorId,
                roomId: roomId,
                appointmentId: appointmentId,
            },
            updateMassDto,
        );
    }

    /**
     * Remove a room from an appointment.
     *
     * @remarks This operation removes a specific room from an appointment.
     */
    @Delete(':id')
    @ApiOkResponse({
        description: 'Successfully removed the room from the appointment.',
    })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to remove this room from the appointment.',
    })
    @ApiNotFoundResponse({
        description: 'Room not found with the given ID for this appointment.',
    })
    remove(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.roomsService.remove(
            institutionId,
            {
                timetableId: timetableId,
                presentatorId: presentatorId,
                roomId: roomId,
                appointmentId: appointmentId,
            },
            id,
        );
    }
}

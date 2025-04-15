import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOkResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiCreatedResponse,
} from '@nestjs/swagger';
import { AccessType, TimeTables } from '@prisma/client';
import {
    TimeTablesFromAppointmentsService,
    TimeTablesService,
} from './timetables.service';
import { Access } from '@app/decorators/access.decorator';
import { CreateTimeTableDto } from './dto/create-timetable.dto';
import { UpdateTimeTableDto } from './dto/update-timetable.dto';

@ApiTags('TimeTables')
@ApiBearerAuth()
@Controller('timetables')
export class TimeTablesController {
    constructor(private readonly timetablesService: TimeTablesService) {}

    /**
     * Create a new timetable.
     *
     * @remarks
     * This endpoint allows creating a new timetable under a specified institution.
     */
    @Post()
    @ApiCreatedResponse({ description: 'Successfully created the timetable.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to create a timetable.',
    })
    create(
        @Param('institutionId') institutionId: string,
        @Body() createTimetableDto: CreateTimeTableDto,
    ): Promise<void> {
        return this.timetablesService.create(institutionId, createTimetableDto);
    }

    /**
     * Clones a new timetable.
     *
     * @remarks
     * This endpoint allows cloning an existing timetable with all of its appointments under a specified institution.
     */
    @Post(':id/clone')
    @ApiCreatedResponse({ description: 'Successfully cloned the timetable.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to clone a timetable.',
    })
    clone(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
        @Body() updateTimeTableDto: UpdateTimeTableDto,
    ): Promise<void> {
        return this.timetablesService.clone(
            institutionId,
            id,
            updateTimeTableDto,
        );
    }

    /**
     * Retrieve all timetables for a given institution.
     *
     * @remarks
     * Fetches all timetables associated with the specified institution.
     */
    @Get()
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({ description: 'Successfully retrieved all timetables.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access timetables.',
    })
    findAll(
        @Param('institutionId') institutionId: string,
    ): Promise<TimeTables[]> {
        return this.timetablesService.findAll(institutionId);
    }

    /**
     * Retrieve a specific timetable by ID.
     *
     * @remarks
     * Fetches the details of a timetable using its ID.
     */
    @Get(':id')
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({ description: 'Successfully retrieved the timetable.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access this timetable.',
    })
    @ApiNotFoundResponse({
        description: 'Timetable not found with the given ID.',
    })
    findOne(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
    ): Promise<TimeTables> {
        return this.timetablesService.findOne(institutionId, id);
    }

    /**
     * Update a timetable's details.
     *
     * @remarks
     * This endpoint allows modifying the details of a specific timetable.
     */
    @Patch(':id')
    @ApiOkResponse({ description: 'Successfully updated the timetable.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to update this timetable.',
    })
    @ApiNotFoundResponse({
        description: 'Timetable not found with the given ID.',
    })
    update(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
        @Body() updateTimetableDto: UpdateTimeTableDto,
    ): Promise<void> {
        return this.timetablesService.update(
            institutionId,
            id,
            updateTimetableDto,
        );
    }

    /**
     * Remove a timetable.
     *
     * @remarks
     * Deletes a timetable by its ID.
     */
    @Delete(':id')
    @ApiOkResponse({ description: 'Successfully removed the timetable.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to remove this timetable.',
    })
    @ApiNotFoundResponse({
        description: 'Timetable not found with the given ID.',
    })
    remove(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.timetablesService.remove(institutionId, id);
    }
}

@ApiTags('TimeTables')
@ApiBearerAuth()
@Controller([
    'timetables/:timetableId/appointments/:appointmentId/timetables',
    'presentators/:presentatorId/appointments/:appointmentId/timetables',
    'rooms/:roomId/appointments/:appointmentId/timetables',
])
export class TimeTablesFromAppointmentsController {
    constructor(
        private readonly timetablesService: TimeTablesFromAppointmentsService,
    ) {}

    /**
     * Associate a timetable with an appointment.
     *
     * @remarks
     * Links an existing timetable to a specific appointment.
     */
    @Post(':id')
    @HttpCode(200)
    @ApiOkResponse({
        description: 'Successfully added timetable to appointment.',
    })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to modify this appointment.',
    })
    add(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.timetablesService.add(
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
     * Retrieve all timetables associated with a specific appointment.
     *
     * @remarks
     * Fetches all timetables linked to a given appointment.
     */
    @Get()
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({ description: 'Successfully retrieved all timetables.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access these timetables.',
    })
    findAll(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
    ): Promise<TimeTables[]> {
        return this.timetablesService.findAll(institutionId, {
            timetableId: timetableId,
            presentatorId: presentatorId,
            roomId: roomId,
            appointmentId: appointmentId,
        });
    }

    /**
     * Retrieve a specific timetable associated with an appointment.
     *
     * @remarks
     * Fetches details of a particular timetable linked to an appointment.
     */
    @Get(':id')
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({ description: 'Successfully retrieved the timetable.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access this timetable.',
    })
    @ApiNotFoundResponse({
        description: 'Timetable not found with the given ID.',
    })
    findOne(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
        @Param('id') id: string,
    ): Promise<TimeTables> {
        return this.timetablesService.findOne(
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
     * Remove a timetable association from an appointment.
     *
     * @remarks
     * Deletes the link between a timetable and an appointment.
     */
    @Delete(':id')
    @ApiOkResponse({
        description: 'Successfully removed timetable from appointment.',
    })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to modify this appointment.',
    })
    @ApiNotFoundResponse({
        description: 'Timetable not found with the given ID.',
    })
    remove(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.timetablesService.remove(
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

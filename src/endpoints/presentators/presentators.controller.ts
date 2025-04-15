import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseArrayPipe,
    HttpCode,
} from '@nestjs/common';
import {
    AccessType,
    Permissions,
    Presentators,
    SpecialPermissions,
} from '@prisma/client';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOkResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiCreatedResponse,
} from '@nestjs/swagger';
import {
    PresentatorsFromAppointmentsService,
    PresentatorsService,
} from './presentators.service';
import { Access } from '@app/decorators/access.decorator';
import { Permission } from '@app/decorators/permission.decorator';
import { SpecialPermission } from '@app/decorators/specialPermission.decorator';
import { CreatePresentatorDto } from './dto/create-presentator.dto';
import {
    UpdateSubstitutionDto,
    UpdateSubstitutionsDto,
} from './dto/update-substitution.dto';
import { UpdateMassDto } from '@app/dto/update-mass.dto';

@ApiTags('Presentators')
@ApiBearerAuth()
@Controller('presentators')
export class PresentatorsController {
    constructor(private readonly presentatorsService: PresentatorsService) {}

    /**
     * Create a new presentator.
     *
     * @remarks This operation creates a new presentator under a specified institution.
     */
    @Post(':id')
    @ApiCreatedResponse({
        description: 'Successfully created the presentator.',
    })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to create a presentator.',
    })
    create(
        @Param('institutionId') institutionId: string,
        @Param('id') userId: string,
        @Body() createPresentatorDto: CreatePresentatorDto,
    ): Promise<void> {
        return this.presentatorsService.create(
            institutionId,
            userId,
            createPresentatorDto,
        );
    }

    /**
     * Retrieve all presentators for a given institution.
     *
     * @remarks This operation fetches all presentators associated with a specific institution.
     */
    @Get()
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({ description: 'Successfully retrieved all presentators.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access presentators.',
    })
    findAll(
        @Param('institutionId') institutionId: string,
    ): Promise<Partial<Presentators>[]> {
        return this.presentatorsService.findAll(institutionId);
    }

    /**
     * Retrieve a specific presentator by ID.
     *
     * @remarks This operation fetches details of a particular presentator.
     */
    @Get(':id')
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({ description: 'Successfully retrieved the presentator.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access this presentator.',
    })
    @ApiNotFoundResponse({
        description: 'Presentator not found with the given ID.',
    })
    findOne(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
    ): Promise<Partial<Presentators>> {
        return this.presentatorsService.findOne(institutionId, id);
    }

    /**
     * Update a presentator substitution.
     *
     * @remarks This operation updates a presentator's substitution details.
     */
    @Patch(':substitutePresentatorId/substitute')
    @Permission([Permissions.READ])
    @SpecialPermission([SpecialPermissions.SUBSTITUTE])
    @ApiOkResponse({ description: 'Successfully updated the substitution.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to update this substitution.',
    })
    @ApiNotFoundResponse({
        description: 'Substitution not found with the given ID.',
    })
    substitution(
        @Param('institutionId') institutionId: string,
        @Param('substitutePresentatorId') id: string,
        @Body() substitutionDto: UpdateSubstitutionsDto,
    ): Promise<void> {
        return this.presentatorsService.substitute(
            institutionId,
            id,
            substitutionDto,
        );
    }

    /**
     * Remove a presentator.
     *
     * @remarks This operation deletes a specific presentator.
     */
    @Delete(':id')
    @ApiOkResponse({ description: 'Successfully removed the presentator.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to remove this presentator.',
    })
    @ApiNotFoundResponse({
        description: 'Presentator not found with the given ID.',
    })
    remove(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.presentatorsService.remove(institutionId, id);
    }
}

@ApiTags('Presentators')
@ApiBearerAuth()
@Controller([
    'timetables/:timetableId/appointments/:appointmentId/presentators',
    'presentators/:presentatorId/appointments/:appointmentId/presentators',
    'rooms/:roomId/appointments/:appointmentId/presentators',
])
export class PresentatorsFromAppointmentsController {
    constructor(
        private readonly presentatorsService: PresentatorsFromAppointmentsService,
    ) {}

    /**
     * Add a presentator to an appointment.
     *
     * @remarks This operation adds a presentator to a specified appointment and timetable.
     */
    @Post(':id')
    @HttpCode(200)
    @ApiOkResponse({ description: 'Successfully added the presentator.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to add a presentator.',
    })
    @ApiNotFoundResponse({
        description: 'Appointment or presentator not found.',
    })
    add(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.presentatorsService.add(
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
     * Retrieve all presentators for a specific appointment.
     *
     * @remarks This operation fetches all presentators for the specified appointment, timetable, room, and presentator.
     */
    @Get()
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({
        description:
            'Successfully retrieved all presentators for the appointment.',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden. You do not have permission to view this data.',
    })
    @ApiNotFoundResponse({ description: 'Appointment not found.' })
    findAll(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
    ): Promise<Presentators[]> {
        return this.presentatorsService.findAll(institutionId, {
            timetableId: timetableId,
            presentatorId: presentatorId,
            roomId: roomId,
            appointmentId: appointmentId,
        });
    }

    /**
     * Retrieves a list of available presentators for a given timetable and appointment.
     *
     * @remarks This operation checks for presentators that are currently unoccupied during
     * the specified appointment time. It allows users to find alternative presentators
     * based on scheduling constraints.
     */
    @Get('available')
    @ApiOkResponse({
        description:
            'Successfully retrieved all presentators for the appointment.',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden. You do not have permission to view this data.',
    })
    @ApiNotFoundResponse({ description: 'Appointment not found.' })
    findAvailablePresentators(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
    ): Promise<Presentators[]> {
        return this.presentatorsService.findAvailablePresentators(
            institutionId,
            {
                timetableId: timetableId,
                presentatorId: presentatorId,
                roomId: roomId,
                appointmentId: appointmentId,
            },
        );
    }

    /**
     * Retrieve a specific presentator assigned to an appointment.
     *
     * @remarks This operation fetches a specific presentator based on their ID, associated with a given appointment.
     */
    @Get(':id')
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({
        description:
            'Successfully retrieved the presentator for the appointment.',
    })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access this presentator.',
    })
    @ApiNotFoundResponse({
        description: 'Presentator or appointment not found.',
    })
    findOne(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
        @Param('id') id: string,
    ): Promise<Presentators> {
        return this.presentatorsService.findOne(
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
     * Update multiple presentator assignments in bulk.
     *
     * @remarks This operation updates a batch of presentators assigned to an appointment or timetable.
     */
    @Patch()
    @ApiOkResponse({
        description: 'Successfully updated presentator assignments.',
    })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to update presentators.',
    })
    @ApiNotFoundResponse({
        description: 'One or more appointments or presentators not found.',
    })
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
        return this.presentatorsService.update(
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
     * Substitute a presentator for another in a specific appointment.
     *
     * @remarks This operation substitutes one presentator for another in the given appointment and timetable.
     */
    @Patch(':substitutePresentatorId/substitute')
    @Permission([Permissions.READ])
    @SpecialPermission([SpecialPermissions.SUBSTITUTE])
    @ApiOkResponse({ description: 'Successfully substituted the presentator.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to perform this substitution.',
    })
    @ApiNotFoundResponse({
        description: 'Substitute presentator or appointment not found.',
    })
    substitution(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
        @Param('substitutePresentatorId') id: string,
        @Body() substitutionDto: UpdateSubstitutionDto,
    ): Promise<void> {
        return this.presentatorsService.substitute(
            institutionId,
            {
                timetableId: timetableId,
                presentatorId: presentatorId,
                roomId: roomId,
                appointmentId: appointmentId,
            },
            id,
            substitutionDto,
        );
    }

    /**
     * Remove a presentator from an appointment.
     *
     * @remarks This operation deletes the assignment of a specific presentator from an appointment.
     */
    @Delete(':id')
    @ApiOkResponse({
        description:
            'Successfully removed the presentator from the appointment.',
    })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to remove this presentator.',
    })
    @ApiNotFoundResponse({
        description: 'Presentator or appointment not found.',
    })
    remove(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.presentatorsService.remove(
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

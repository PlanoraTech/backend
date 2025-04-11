import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AccessType, Appointments } from '@prisma/client';
import {
    AppointmentsFromTimeTablesService,
    AppointmentsService,
} from './appointments.service';
import { Access } from '@app/decorators/access.decorator';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller([
    'institutions/:institutionId/presentators/:presentatorId/appointments',
    'institutions/:institutionId/rooms/:roomId/appointments',
])
export class AppointmentsController {
    constructor(protected readonly appointmentsService: AppointmentsService) {}

    /**
     * Retrieve all appointments for a specific institution, timetable, presentator, and room
     *
     * @remarks This operation retrieves all appointments based on the given institution, timetable, presentator, and room IDs.
     */
    @Get()
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({ description: 'Successfully retrieved all appointments.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access these appointments.',
    })
    findAll(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
    ): Promise<Appointments[]> {
        return this.appointmentsService.findAll(institutionId, {
            timetableId: timetableId,
            presentatorId: presentatorId,
            roomId: roomId,
        });
    }

    /**
     * Retrieve a specific appointment by its ID for a given institution, timetable, presentator, and room
     *
     * @remarks This operation retrieves a single appointment by its ID for the given institution, timetable, presentator, and room.
     */
    @Get(':id')
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({ description: 'Successfully retrieved the appointment.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access this appointment.',
    })
    @ApiNotFoundResponse({
        description: 'Appointment not found with the given ID.',
    })
    findOne(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('id') id: string,
    ): Promise<Appointments> {
        return this.appointmentsService.findOne(
            institutionId,
            {
                timetableId: timetableId,
                presentatorId: presentatorId,
                roomId: roomId,
            },
            id,
        );
    }
}

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller([
    'institutions/:institutionId/timetables/:timetableId/appointments',
])
export class AppointmentsFromTimeTablesController extends AppointmentsController {
    constructor(
        protected readonly appointmentsService: AppointmentsFromTimeTablesService,
    ) {
        super(appointmentsService);
    }

    /**
     * Create a new appointment for a given institution and timetable
     *
     * @remarks This operation allows you to create a new appointment for a specific institution and timetable.
     */
    @Post()
    @ApiCreatedResponse({
        description: 'The appointment has been successfully created.',
    })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to create this appointment.',
    })
    create(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Body() createAppointmentDto: CreateAppointmentDto,
    ): Promise<{ id: string }> {
        return this.appointmentsService.create(
            institutionId,
            timetableId,
            createAppointmentDto,
        );
    }

    /**
     * Update an existing appointment for a specific institution and timetable
     *
     * @remarks This operation updates an existing appointment. It requires the institution, timetable, and appointment ID.
     */
    @Patch(':id')
    @ApiOkResponse({
        description: 'The appointment has been successfully updated.',
    })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to update this appointment.',
    })
    @ApiNotFoundResponse({
        description: 'Appointment not found with the given ID.',
    })
    update(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('id') id: string,
        @Body() updateAppointmentDto: UpdateAppointmentDto,
    ): Promise<void> {
        return this.appointmentsService.update(
            institutionId,
            timetableId,
            id,
            updateAppointmentDto,
        );
    }

    /**
     * Remove an appointment for a specific institution and timetable
     *
     * @remarks This operation allows you to delete an appointment for a specific institution and timetable.
     */
    @Delete(':id')
    @ApiOkResponse({
        description: 'The appointment has been successfully removed.',
    })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to delete this appointment.',
    })
    @ApiNotFoundResponse({
        description: 'Appointment not found with the given ID.',
    })
    remove(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.appointmentsService.remove(institutionId, timetableId, id);
    }
}

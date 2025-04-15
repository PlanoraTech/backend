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
    ApiTags,
    ApiOkResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiCreatedResponse,
} from '@nestjs/swagger';
import { AccessType, Events } from '@prisma/client';
import { EventsService } from './events.service';
import { Access } from '@app/decorators/access.decorator';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('Events')
@ApiBearerAuth()
@Controller()
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    /**
     * Create a new event for a specific institution
     *
     * @remarks This operation allows creating a new event under a given institution.
     */
    @Post()
    @ApiCreatedResponse({ description: 'Successfully created the event.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to create an event.',
    })
    create(
        @Param('institutionId') institutionId: string,
        @Body() createEventDto: CreateEventDto,
    ): Promise<void> {
        return this.eventsService.create(institutionId, createEventDto);
    }

    /**
     * Retrieve all events for a specific institution
     *
     * @remarks This operation fetches all events associated with a given institution.
     */
    @Get()
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({ description: 'Successfully retrieved all events.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access these events.',
    })
    findAll(@Param('institutionId') institutionId: string): Promise<Events[]> {
        return this.eventsService.findAll(institutionId);
    }

    /**
     * Retrieve a specific event by ID within an institution
     *
     * @remarks This operation fetches the details of a particular event within the given institution.
     */
    @Get(':id')
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({ description: 'Successfully retrieved the event.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access this event.',
    })
    @ApiNotFoundResponse({ description: 'Event not found with the given ID.' })
    findOne(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
    ): Promise<Events> {
        return this.eventsService.findOne(institutionId, id);
    }

    /**
     * Update an existing event within an institution
     *
     * @remarks This operation modifies the details of an existing event within the given institution.
     */
    @Patch(':id')
    @ApiOkResponse({ description: 'Successfully updated the event.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to update this event.',
    })
    @ApiNotFoundResponse({ description: 'Event not found with the given ID.' })
    update(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
        @Body() updateEventDto: UpdateEventDto,
    ): Promise<void> {
        return this.eventsService.update(institutionId, id, updateEventDto);
    }

    /**
     * Delete a specific event from an institution
     *
     * @remarks This operation removes an event from the given institution.
     */
    @Delete(':id')
    @ApiOkResponse({ description: 'Successfully deleted the event.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to delete this event.',
    })
    @ApiNotFoundResponse({ description: 'Event not found with the given ID.' })
    remove(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.eventsService.remove(institutionId, id);
    }
}

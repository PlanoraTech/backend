import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Events } from '@prisma/client';
import { Access, AccessTypes } from 'src/decorators/access.decorator';

@Controller()
export class EventsController {
	constructor(private readonly eventsService: EventsService) { }

	@Post()
	@Access(AccessTypes.PRIVATE)
	create(@Param('institutionId') institutionId: string, @Body() createEventDto: CreateEventDto): Promise<void> {
		return this.eventsService.create(institutionId, createEventDto);
	}

	@Get()
	@Access(AccessTypes.RESTRICTED)
	findAll(@Param('institutionId') institutionId: string): Promise<Events[]> {
		return this.eventsService.findAll(institutionId);
	}

	@Get(':id')
	@Access(AccessTypes.RESTRICTED)
	findOne(@Param('institutionId') institutionId: string, @Param('id') id: string): Promise<Events> {
		return this.eventsService.findOne(institutionId, id);
	}

	@Patch(':id')
	@Access(AccessTypes.PRIVATE)
	update(@Param('institutionId') institutionId: string, @Param('id') id: string, @Body() updateEventDto: UpdateEventDto): Promise<void> {
		return this.eventsService.update(institutionId, id, updateEventDto);
	}

	@Delete(':id')
	@Access(AccessTypes.PRIVATE)
	remove(@Param('institutionId') institutionId: string, @Param('id') id: string): Promise<void> {
		return this.eventsService.remove(institutionId, id);
	}
}
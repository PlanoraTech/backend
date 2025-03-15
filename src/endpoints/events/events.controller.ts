import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccessType, Events } from '@prisma/client';
import { EventsService } from './events.service';
import { Access } from '@app/decorators/access.decorator';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller()
export class EventsController {
	constructor(private readonly eventsService: EventsService) { }

	@Post()
	create(@Param('institutionId') institutionId: string, @Body() createEventDto: CreateEventDto): Promise<void> {
		return this.eventsService.create(institutionId, createEventDto);
	}

	@Get()
	@Access(AccessType.PUBLIC)
	findAll(@Param('institutionId') institutionId: string): Promise<Events[]> {
		return this.eventsService.findAll(institutionId);
	}

	@Get(':id')
	@Access(AccessType.PUBLIC)
	findOne(@Param('institutionId') institutionId: string, @Param('id') id: string): Promise<Events> {
		return this.eventsService.findOne(institutionId, id);
	}

	@Patch(':id')
	update(@Param('institutionId') institutionId: string, @Param('id') id: string, @Body() updateEventDto: UpdateEventDto): Promise<void> {
		return this.eventsService.update(institutionId, id, updateEventDto);
	}

	@Delete(':id')
	remove(@Param('institutionId') institutionId: string, @Param('id') id: string): Promise<void> {
		return this.eventsService.remove(institutionId, id);
	}
}
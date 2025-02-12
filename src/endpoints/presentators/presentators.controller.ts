import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PresentatorsFromAppointmentsService, PresentatorsService } from './presentators.service';
import { CreatePresentatorDto } from './dto/create-presentator.dto';
import { UpdatePresentatorDto } from './dto/update-presentator.dto';
import { Access, AccessTypes } from 'src/decorators/access.decorator';
import { Presentators } from '@prisma/client';

@Controller('presentators')
export class PresentatorsController {
	constructor(private readonly presentatorsService: PresentatorsService) { }

	@Post()
	@Access(AccessTypes.PRIVATE)
	create(@Param('institutionId') institutionId: string, @Body() createPresentatorDto: CreatePresentatorDto): Promise<void> {
		return this.presentatorsService.create(institutionId, createPresentatorDto);
	}

	@Get()
	@Access(AccessTypes.RESTRICTED)
	findAll(@Param('institutionId') institutionId: string): Promise<Partial<Presentators>[]> {
		return this.presentatorsService.findAll(institutionId, {
			name: true,
		});
	}

	@Get(':id')
	@Access(AccessTypes.RESTRICTED)
	findOne(@Param('institutionId') institutionId: string, @Param('id') id: string): Promise<Partial<Presentators>> {
		return this.presentatorsService.findOne(institutionId, id, {
			name: true,
		});
	}

	@Patch(':id')
	@Access(AccessTypes.PRIVATE)
	update(@Param('institutionId') institutionId: string, @Param('id') id: string, @Body() updatePresentatorDto: UpdatePresentatorDto): Promise<void> {
		return this.presentatorsService.update(institutionId, id, updatePresentatorDto);
	}

	@Delete(':id')
	@Access(AccessTypes.PRIVATE)
	remove(@Param('institutionId') institutionId: string, @Param('id') id: string): Promise<void> {
		return this.presentatorsService.remove(institutionId, id);
	}
}

@Controller([
	'timetables/:timetableId/appointments/:appointmentId/presentators',
	'presentators/:presentatorId/appointments/:appointmentId/presentators',
	'rooms/:roomId/appointments/:appointmentId/presentators',
])
export class PresentatorsFromAppointmentsController {
	constructor(private readonly presentatorsService: PresentatorsFromAppointmentsService) { }
	
	@Post(':id')
	@Access(AccessTypes.PRIVATE)
	add(@Param('institutionId') institutionId: string, @Param('timetableId') timetableId: string, @Param('presentatorId') presentatorId: string, @Param('roomId') roomId: string, @Param('appointmentId') appointmentId: string, @Param('id') id: string): Promise<void> {
		return this.presentatorsService.add(institutionId, {
			timetableId: timetableId,
			presentatorId: presentatorId,
			roomId: roomId,
			appointmentId: appointmentId,
		}, id);
	}

	@Get()
	@Access(AccessTypes.RESTRICTED)
	findAll(@Param('institutionId') institutionId: string, @Param('timetableId') timetableId: string, @Param('presentatorId') presentatorId: string, @Param('roomId') roomId: string, @Param('appointmentId') appointmentId: string): Promise<Partial<Presentators>[]> {
		return this.presentatorsService.findAll(institutionId, {
			timetableId: timetableId,
			presentatorId: presentatorId,
			roomId: roomId,
			appointmentId: appointmentId,
		}, {
			name: true,
		});
	}

	@Delete(':id')
	@Access(AccessTypes.PRIVATE)
	remove(@Param('institutionId') institutionId: string, @Param('timetableId') timetableId: string, @Param('presentatorId') presentatorId: string, @Param('roomId') roomId: string, @Param('appointmentId') appointmentId: string, @Param('id') id: string): Promise<void> {
		return this.presentatorsService.add(institutionId, {
			timetableId: timetableId,
			presentatorId: presentatorId,
			roomId: roomId,
			appointmentId: appointmentId,
		}, id);
	}
}
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Presentators } from '@prisma/client';
import { PresentatorsFromAppointmentsService, PresentatorsService } from './presentators.service';
import { Access, AccessTypes } from '@app/decorators/access.decorator';
import { CreatePresentatorDto } from './dto/create-presentator.dto';
import { UpdateSubstitutionDto, UpdateSubstitutionsDto } from './dto/update-substitution.dto';

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
		return this.presentatorsService.findAll(institutionId);
	}

	@Get(':id')
	@Access(AccessTypes.RESTRICTED)
	findOne(@Param('institutionId') institutionId: string, @Param('id') id: string): Promise<Partial<Presentators>> {
		return this.presentatorsService.findOne(institutionId, id);
	}

	@Patch(':substitutePresentatorId/substitute')
	@Access(AccessTypes.GRANTED)
	substitution(@Param('institutionId') institutionId: string, @Param('substitutePresentatorId') id: string, @Body() substitutionDto: UpdateSubstitutionsDto): Promise<void> {
		return this.presentatorsService.substitute(institutionId, id, substitutionDto);
	}

	@Delete(':id')
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
	findAll(@Param('institutionId') institutionId: string, @Param('timetableId') timetableId: string, @Param('presentatorId') presentatorId: string, @Param('roomId') roomId: string, @Param('appointmentId') appointmentId: string): Promise<Presentators[]> {
		return this.presentatorsService.findAll(institutionId, {
			timetableId: timetableId,
			presentatorId: presentatorId,
			roomId: roomId,
			appointmentId: appointmentId,
		});
	}
	
	@Get(':id')
	@Access(AccessTypes.RESTRICTED)
	findOne(@Param('institutionId') institutionId: string, @Param('timetableId') timetableId: string, @Param('presentatorId') presentatorId: string, @Param('roomId') roomId: string, @Param('appointmentId') appointmentId: string, @Param('id') id: string): Promise<Presentators> {
		return this.presentatorsService.findOne(institutionId, {
			timetableId: timetableId,
			presentatorId: presentatorId,
			roomId: roomId,
			appointmentId: appointmentId,
		}, id);
	}

	@Patch(':substitutePresentatorId/substitute')
	@Access(AccessTypes.GRANTED)
	substitution(@Param('institutionId') institutionId: string, @Param('timetableId') timetableId: string, @Param('presentatorId') presentatorId: string, @Param('roomId') roomId: string, @Param('appointmentId') appointmentId: string, @Param('substitutePresentatorId') id: string, @Body() substitutionDto: UpdateSubstitutionDto): Promise<void> {
		return this.presentatorsService.substitute(institutionId, {
			timetableId: timetableId,
			presentatorId: presentatorId,
			roomId: roomId,
			appointmentId: appointmentId,
		}, id, substitutionDto);
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
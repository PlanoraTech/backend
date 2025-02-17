import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomsFromAppointmentsService, RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Access, AccessTypes } from '../../decorators/access.decorator';
import { Rooms } from '@prisma/client';

@Controller('rooms')
export class RoomsController {
	constructor(private readonly roomsService: RoomsService) { }

	@Post()
	@Access(AccessTypes.PRIVATE)
	create(@Param('institutionId') institutionId: string, @Body() createRoomDto: CreateRoomDto): Promise<void> {
		return this.roomsService.create(institutionId, createRoomDto);
	}

	@Get()
	@Access(AccessTypes.RESTRICTED)
	findAll(@Param('institutionId') institutionId: string): Promise<Partial<Rooms>[]> {
		return this.roomsService.findAll(institutionId, {
			name: true,
		});
	}

	@Get(':id')
	@Access(AccessTypes.RESTRICTED)
	findOne(@Param('institutionId') institutionId: string, @Param('id') id: string): Promise<Partial<Rooms>> {
		return this.roomsService.findOne(institutionId, id, {
			name: true,
		});
	}

	@Patch(':id')
	@Access(AccessTypes.PRIVATE)
	update(@Param('institutionId') institutionId: string, @Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto): Promise<void> {
		return this.roomsService.update(institutionId, id, updateRoomDto);
	}

	@Delete(':id')
	@Access(AccessTypes.PRIVATE)
	remove(@Param('institutionId') institutionId: string, @Param('id') id: string): Promise<void> {
		return this.roomsService.remove(institutionId, id);
	}
}

@Controller([
	'timetables/:timetableId/appointments/:appointmentId/rooms',
	'presentators/:presentatorId/appointments/:appointmentId/rooms',
	'rooms/:roomId/appointments/:appointmentId/rooms',
])
export class RoomsFromAppointmentsController {
	constructor(private readonly roomsService: RoomsFromAppointmentsService) { }
	
	@Post(':id')
	@Access(AccessTypes.PRIVATE)
	add(@Param('institutionId') institutionId: string, @Param('timetableId') timetableId: string, @Param('presentatorId') presentatorId: string, @Param('roomId') roomId: string, @Param('appointmentId') appointmentId: string, @Param('id') id: string): Promise<void> {
		return this.roomsService.add(institutionId, {
			timetableId: timetableId,
			presentatorId: presentatorId,
			roomId: roomId,
			appointmentId: appointmentId,
		}, id);
	}

	@Get()
	@Access(AccessTypes.RESTRICTED)
	findAll(@Param('institutionId') institutionId: string, @Param('timetableId') timetableId: string, @Param('presentatorId') presentatorId: string, @Param('roomId') roomId: string, @Param('appointmentId') appointmentId: string): Promise<Partial<Rooms>[]> {
		return this.roomsService.findAll(institutionId, {
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
		return this.roomsService.add(institutionId, {
			timetableId: timetableId,
			presentatorId: presentatorId,
			roomId: roomId,
			appointmentId: appointmentId,
		}, id);
	}
}
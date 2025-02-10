import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Access, AccessTypes } from 'src/decorators/access.decorator';
import { Rooms } from '@prisma/client';

@Controller()
export class RoomsController {
	constructor(private readonly roomsService: RoomsService) { }

	@Post()
	@Access(AccessTypes.PRIVATE)
	create(@Param('institutionsId') institutionsId: string, @Body() createRoomDto: CreateRoomDto) {
		return this.roomsService.create(institutionsId, createRoomDto);
	}

	@Get()
	@Access(AccessTypes.RESTRICTED)
	findAll(@Param('institutionsId') institutionsId: string): Promise<Partial<Rooms>[]> {
		return this.roomsService.findAll(institutionsId, {
			name: true,
		});
	}

	@Get(':id')
	@Access(AccessTypes.RESTRICTED)
	findOne(@Param('institutionsId') institutionsId: string, @Param('id') id: string): Promise<Partial<Rooms>> {
		return this.roomsService.findOne(institutionsId, id, {
			name: true,
		});
	}

	@Patch(':id')
	@Access(AccessTypes.PRIVATE)
	update(@Param('institutionsId') institutionsId: string, @Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
		return this.roomsService.update(institutionsId, id, updateRoomDto);
	}

	@Delete(':id')
	@Access(AccessTypes.PRIVATE)
	remove(@Param('institutionsId') institutionsId: string, @Param('id') id: string) {
		return this.roomsService.remove(institutionsId, id);
	}
}
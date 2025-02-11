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
	create(@Param('institutionId') institutionId: string, @Body() createRoomDto: CreateRoomDto) {
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
	update(@Param('institutionId') institutionId: string, @Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
		return this.roomsService.update(institutionId, id, updateRoomDto);
	}

	@Delete(':id')
	@Access(AccessTypes.PRIVATE)
	remove(@Param('institutionId') institutionId: string, @Param('id') id: string) {
		return this.roomsService.remove(institutionId, id);
	}
}
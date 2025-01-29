import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ExtendedRooms } from './types/rooms.type';

@Controller()
export class RoomsController {
	constructor(private readonly roomsService: RoomsService) { }

	@Post()
	create(@Body() createRoomDto: CreateRoomDto) {
		return this.roomsService.create(createRoomDto);
	}

	@Get()
	findAll(@Param('institutionsId') institutionsId: string): Promise<Partial<ExtendedRooms>[]> {
		return this.roomsService.findAll(institutionsId, {
			name: true,
			isAvailable: true,
		});
	}

	@Get(':id')
	findOne(@Param('institutionsId') institutionsId: string, @Param('id') id: string): Promise<Partial<ExtendedRooms>> {
		return this.roomsService.findOne(institutionsId, id, {
			name: true,
			isAvailable: true,
		});
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
		return this.roomsService.update(+id, updateRoomDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.roomsService.remove(+id);
	}
}
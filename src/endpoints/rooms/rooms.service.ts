import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InstitutionsService } from 'src/endpoints/institutions/institutions.service';

@Injectable()
export class RoomsService {
	constructor(private institutionsService: InstitutionsService) { }
	create(createRoomDto: CreateRoomDto) {
		return 'This action adds a new room';
	}

	async findAll(institutionsId: string, select?: {
		name?: boolean,
		isAvailable?: boolean,
		appointments?: {
			select: {
				id?: boolean,
				subject?: boolean,
				presentators?: boolean,
				rooms?: boolean,
				dayOfWeek?: boolean,
				start?: boolean,
				end?: boolean,
				isCancelled?: boolean,
				timetables?: boolean,
			},
		},
		institution?: boolean,
	}) {
		return (await this.institutionsService.findOne(institutionsId, {
			rooms: {
				select: {
					id: true,
					...select,
				},
			},
		})).rooms;
	}

	async findOne(institutionsId: string, id: string, select?: {
		name?: boolean,
		isAvailable?: boolean,
		appointments?: {
			select: {
				id?: boolean,
				subject?: boolean,
				presentators?: boolean,
				rooms?: boolean,
				dayOfWeek?: boolean,
				start?: boolean,
				end?: boolean,
				isCancelled?: boolean,
				timetables?: boolean,
			},
		},
		institution?: boolean,
	}) {
		return (await this.institutionsService.findOne(institutionsId, {
			rooms: {
				select: {
					id: true,
					...select,
				},
			},
		})).rooms.find((room) => room.id === id);
	}

	update(id: number, updateRoomDto: UpdateRoomDto) {
		return `This action updates a #${id} room`;
	}

	remove(id: number) {
		return `This action removes a #${id} room`;
	}
}
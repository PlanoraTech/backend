import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaClient, Rooms } from '@prisma/client';

interface RoomsSelect {
	name?: boolean,
}

@Injectable()
export class RoomsService {
	constructor(private readonly prisma: PrismaClient) { }
	async create(institutionsId: string, createRoomDto: CreateRoomDto) {
		return await this.prisma.rooms.create({
			select: {
				id: true,
			},
			data: {
				...createRoomDto,
				institution: {
					connect: {
						id: institutionsId,
					}
				},
			},
		});
	}

	async findAll(institutionsId: string, select?: RoomsSelect): Promise<Partial<Rooms>[]> {
		return await this.prisma.rooms.findMany({
			select: {
				id: true,
				...select,
			},
			where: {
				institutionId: institutionsId,
			},
		});
	}

	async findOne(institutionsId: string, id: string, select?: RoomsSelect): Promise<Partial<Rooms>> {
		return await this.prisma.rooms.findUniqueOrThrow({
			select: {
				id: true,
				...select,
			},
			where: {
				id: id,
				institutionId: institutionsId,
			},
		});
	}

	async findAvailableRooms(institutionsId: string, date: Date, select?: RoomsSelect): Promise<Partial<Rooms>[]> {
		return await this.prisma.rooms.findMany({
			select: {
				id: true,
				...select,
			},
			where: {
				institutionId: institutionsId,
				appointments: {
					some: {
						start: {
							lte: date,
						},
						end: {
							gte: date,
						},
					},
					none: {
						isCancelled: false,
					}
				}
			},
		});
	}

	async update(institutionsId: string, id: string, updateRoomDto: UpdateRoomDto) {
		return await this.prisma.rooms.update({
			select: {
				id: true,
			},
			data: {
				...updateRoomDto,
			},
			where: {
				id: id,
				institutionId: institutionsId,
			},
		});
	}

	async remove(institutionsId: string, id: string) {
		return await this.prisma.rooms.delete({
			select: {
				id: true,
			},
			where: {
				id: id,
				institutionId: institutionsId,
			},
		});
	}
}
import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ExtendedRooms } from './types/rooms.type';
import { PrismaClient } from '@prisma/client';

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
				isAvailable: true,
				institution: {
					connect: {
						id: institutionsId,
					}
				},
			},
		});
	}

	async findAll(institutionsId: string, select?: {
		name?: boolean,
		isAvailable?: boolean,
		appointments?: {
			select: {
				id?: boolean,
				subject?: {
					select: {
						id?: boolean,
						name?: boolean,
						subjectId?: boolean,
					}
				},
				presentators?: {
					select: {
						id: boolean,
						presentator: {
							select: {
								name: boolean,
							}
						},
						isSubstituted: boolean,
					}
				},
				rooms?: {
					select: {
						id?: boolean,
						name?: boolean,
						isAvailable?: boolean,
					}
				},
				dayOfWeek?: boolean,
				start?: boolean,
				end?: boolean,
				isCancelled?: boolean,
				timetables?: boolean,
			},
		},
	}): Promise<Partial<ExtendedRooms>[]> {
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

	async findOne(institutionsId: string, id: string, select?: {
		name?: boolean,
		isAvailable?: boolean,
		appointments?: {
			select: {
				id?: boolean,
				subject?: {
					select: {
						id?: boolean,
						name?: boolean,
						subjectId?: boolean,
					}
				},
				presentators?: {
					select: {
						id: boolean,
						presentator: {
							select: {
								name: boolean,
							}
						},
						isSubstituted: boolean,
					}
				},
				rooms?: {
					select: {
						id?: boolean,
						name?: boolean,
						isAvailable?: boolean,
					}
				},
				dayOfWeek?: boolean,
				start?: boolean,
				end?: boolean,
				isCancelled?: boolean,
				timetables?: boolean,
			},
		},
	}): Promise<Partial<ExtendedRooms>> {
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
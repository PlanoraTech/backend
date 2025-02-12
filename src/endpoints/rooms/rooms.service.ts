import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaClient, Rooms } from '@prisma/client';
import { DataServiceIds } from 'src/interfaces/DataServiceIds';

interface RoomsSelect {
	name?: boolean,
}

@Injectable()
export class RoomsService {
	constructor(private readonly prisma: PrismaClient) { }
	async create(institutionId: string, createRoomDto: CreateRoomDto): Promise<void> {
		await this.prisma.rooms.create({
			select: {
				id: true,
			},
			data: {
				...createRoomDto,
				institutionId: institutionId,
			},
		});
	}

	async findAll(institutionId: string, select?: RoomsSelect): Promise<Partial<Rooms>[]> {
		return await this.prisma.rooms.findMany({
			select: {
				id: true,
				...select,
			},
			where: {
				institutionId: institutionId,
			},
		});
	}

	async findOne(institutionId: string, id: string, select?: RoomsSelect): Promise<Partial<Rooms>> {
		return await this.prisma.rooms.findUniqueOrThrow({
			select: {
				id: true,
				...select,
			},
			where: {
				id: id,
				institutionId: institutionId,
			},
		});
	}

	async findAvailableRooms(institutionId: string, date: Date, select?: RoomsSelect): Promise<Partial<Rooms>[]> {
		return await this.prisma.rooms.findMany({
			select: {
				id: true,
				...select,
			},
			where: {
				institutionId: institutionId,
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

	async update(institutionId: string, id: string, updateRoomDto: UpdateRoomDto): Promise<void> {
		await this.prisma.rooms.update({
			select: {
				id: true,
			},
			data: {
				...updateRoomDto,
			},
			where: {
				id: id,
				institutionId: institutionId,
			},
		});
	}

	async remove(institutionId: string, id: string): Promise<void> {
		await this.prisma.rooms.delete({
			select: {
				id: true,
			},
			where: {
				id: id,
				institutionId: institutionId,
			},
		});
	}
}

@Injectable()
export class RoomsFromAppointmentsService {
	constructor(private readonly prisma: PrismaClient) { }
	async add(institutionId: string, dataServiceIds: DataServiceIds, roomId: string): Promise<void> {
		await this.prisma.appointments.update({
			data: {
				rooms: {
					connect: {
						id: roomId,
						institutionId: institutionId,
					}
				}
			},
			where: {
				id: dataServiceIds.appointmentId,
				timetables: {
					some: {
						id: dataServiceIds.timetableId,
						institutionId: institutionId,
					}
				},
				rooms: {
					some: {
						id: dataServiceIds.roomId,
						institutionId: institutionId,
					}
				},
				presentators: {
					some: {
						presentator: {
							id: dataServiceIds.presentatorId,
							institutionId: institutionId,
						}
					}
				},
			}
		});
	}

	async findAll(institutionId: string, dataServiceIds: DataServiceIds, select?: RoomsSelect): Promise<Partial<Rooms>[]> {
		return await this.prisma.rooms.findMany({
			select: {
				id: true,
				...select,
			},
			where: {
				appointments: {
					some: {
						id: dataServiceIds.appointmentId,
						timetables: {
							some: {
								id: dataServiceIds.timetableId,
								institutionId: institutionId,
							}
						},
						rooms: {
							some: {
								id: dataServiceIds.roomId,
								institutionId: institutionId,
							}
						},
						presentators: {
							some: {
								presentator: {
									id: dataServiceIds.presentatorId,
									institutionId: institutionId,
								}
							}
						}
					}
				},
			},
		});
	}

	async remove(institutionId: string, dataServiceIds: DataServiceIds, roomId: string): Promise<void> {
		await this.prisma.appointments.update({
			data: {
				rooms: {
					disconnect: {
						id: roomId,
						institutionId: institutionId,
					}
				}
			},
			where: {
				id: dataServiceIds.appointmentId,
				timetables: {
					some: {
						id: dataServiceIds.timetableId,
						institutionId: institutionId,
					}
				},
				rooms: {
					some: {
						id: dataServiceIds.roomId,
						institutionId: institutionId,
					}
				},
				presentators: {
					some: {
						presentator: {
							id: dataServiceIds.presentatorId,
							institutionId: institutionId,
						}
					}
				},
			}
		});
	}
}
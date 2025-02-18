import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Users } from '@prisma/client';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) { }

	async add(institutionId: string, userDto: UserDto): Promise<void> {
		await this.prisma.users.update({
			select: {
				email: true,
			},
			data: {
				institutions: {
					connect: {
						id: institutionId,
					},
				},
			},
			where: {
				email: userDto.email,
			},
		});
	}

	async findAll(institutionId: string, select?: {
		email?: boolean,
		role?: boolean,
	}): Promise<Partial<Users>[]> {
		return await this.prisma.users.findMany({
			select: {
				role: true,
				...select,
			},
			where: {
				institutions: {
					some: {
						id: institutionId,
					},
				},
			},
		})
	}

	async remove(institutionId: string, userDto: UserDto): Promise<void> {
		await this.prisma.users.update({
			select: {
				email: true,
			},
			data: {
				institutions: {
					disconnect: {
						id: institutionId,
					},
				},
			},
			where: {
				email: userDto.email,
			},
		});
	}
}
import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaClient, Roles, Users } from '@prisma/client';

@Injectable()
export class UsersService {
	private static readonly prisma: PrismaClient = new PrismaClient();
	constructor(private readonly prisma: PrismaClient) { }

	static async getIfInstitutionIsAssignedToAUserByToken(token: string, institutionsId: string): Promise<boolean> {
		await this.prisma.users.findFirstOrThrow({
			select: {
				institutions: {
					select: {
						id: true,
					},
				},
			},
			where: {
				institutions: {
					some: {
						id: institutionsId,
					},
				},
				tokens: {
					some: {
						token: token,
					},
				},
			},
		}).catch(() => {
			throw new ForbiddenException("You do not have permission to access this information");
		});
		return true;
	}

	static async getIfRoleIsAssignedToAUserByToken(token: string, role: Roles): Promise<boolean> {
		await this.prisma.users.findFirstOrThrow({
			select: {
				role: true,
			},
			where: {
				role: role,
				tokens: {
					some: {
						token: token,
					},
				},
			},
		}).catch(() => {
			throw new ForbiddenException("You do not have permission to access this information");
		});
		return true;
	}

	async add(institutionsId: string, userDto: UserDto) {
		return await this.prisma.users.update({
			select: {
				email: true,
			},
			data: {
				institutions: {
					connect: {
						id: institutionsId,
					},
				},
			},
			where: {
				email: userDto.email,
			},
		});
	}

	async findAll(institutionsId: string, select?: {
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
						id: institutionsId,
					},
				},
			},
		})
	}

	async remove(institutionsId: string, userDto: UserDto): Promise<void> {
		await this.prisma.users.update({
			select: {
				email: true,
			},
			data: {
				institutions: {
					disconnect: {
						id: institutionsId,
					},
				},
			},
			where: {
				email: userDto.email,
			},
		});
	}
}
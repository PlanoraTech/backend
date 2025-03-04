import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Users } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SecretService } from '../auth/secret/secret.service';

@Injectable()
export class ProfileService {
	constructor(private readonly prisma: PrismaService) { }

	async get(token: string): Promise<Partial<Users>> {
		let userId: string = await SecretService.getUserIdByToken(token);
		return await this.prisma.users.findUniqueOrThrow({
			select: {
				email: true,
				institutions: {
					select: {
						institution: {
							select: {
								name: true,
							}
						},
						role: true,
					}
				}
			},
			where: {
				id: userId,
			},
		});
	}

	async updatePassword(token: string, updateProfileDto: UpdateProfileDto): Promise<void> {
		let userId: string = await SecretService.getUserIdByToken(token);
		await this.prisma.users.update({
			select: {
				id: true,
			},
			data: {
				password: await SecretService.encryptPassword(updateProfileDto.newPassword),
			},
			where: {
				id: userId,
			},
		});
	}

	async remove(token: string): Promise<void> {
		let userId: string = await SecretService.getUserIdByToken(token);
		await this.prisma.users.delete({
			select: {
				id: true,
			},
			where: {
				id: userId,
			},
		});
	}
}
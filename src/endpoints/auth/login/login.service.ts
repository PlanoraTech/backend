import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { SecretService, TokenExpiry } from '../secret/secret.service';
import { Login } from './interfaces/Login';

@Injectable()
export class LoginService {
	constructor(private readonly prisma: PrismaService) { }

	async loginByToken(token: string): Promise<Login> {
		return await this.prisma.tokens.findUniqueOrThrow({
			select: {
				user: {
					select: {
						institutions: {
							select: {
								institutionId: true,
								role: true,
								presentatorId: true,
							},
						}
					}
				},
				expiry: true,
			},
			where: {
				token: token,
				expiry: {
					gt: new Date(),
				},
			}
		});
	}

	async loginByEmailAndPassword(email: string, password: string, tokenExpiry?: TokenExpiry): Promise<Login> {
		let user = await this.prisma.users.findUniqueOrThrow({
			select: {
				id: true,
				password: true,
				institutions: {
					select: {
						institutionId: true,
						role: true,
						presentatorId: true,
					},
				}
			},
			where: {
				email: email,
			},
		});
		if (await SecretService.comparePassword(password, user.password)) {
			let token: { token: string; expiry: Date; } = (await SecretService.getActiveToken(user.id)) ?? (await SecretService.createToken(user.id, tokenExpiry));
			return {
				user: {
					institutions: user.institutions,
				},
				token: token.token,
				expiry: token.expiry,
			};
		}
		throw new NotFoundException("Invalid email or password");
	}
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { SecretService, TokenExpiry } from '@app/auth/secret/secret.service';
import { Login } from './interfaces/Login';
import { User } from '@app/interfaces/User.interface';

@Injectable()
export class LoginService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly secretService: SecretService,
	) { }

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
		let user: (User & { password: string }) = await this.prisma.users.findUniqueOrThrow({
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
		if (await this.secretService.comparePassword(password, user.password)) {
			let token: { token: string; } = await this.secretService.createToken(user.id, tokenExpiry);
			return {
				user: {
					institutions: user.institutions,
				},
				token: token.token,
			};
		}
		throw new NotFoundException("Invalid email or password");
	}
}
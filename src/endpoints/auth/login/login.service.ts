import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Tokens } from '@prisma/client';
import { SecretService, TokenExpiry } from '../secret/secret.service';
import { ExtendedLogin } from './types/login.type';

@Injectable()
export class LoginService {
	constructor(private readonly prisma: PrismaService) { }

	async loginByToken(token: string): Promise<Partial<ExtendedLogin>> {
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

	async loginByEmailAndPassword(email: string, password: string, tokenExpiry?: TokenExpiry): Promise<Partial<ExtendedLogin>> {
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
		switch (await SecretService.comparePassword(password, user.password)) {
			case true:
				let token: Partial<Tokens> = (await SecretService.getActiveToken(user.id)) ?? (await SecretService.createToken(user.id, tokenExpiry));
				return {
					user: {
						institutions: user.institutions,
					},
					token: token.token,
					expiry: token.expiry,
				};
			default:
				throw new NotFoundException;
		};
	}
}
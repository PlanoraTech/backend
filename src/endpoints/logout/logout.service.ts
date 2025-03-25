import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class LogoutService {
	constructor(private readonly prisma: PrismaService) { }

	async logout(token: string): Promise<void> {
		await this.prisma.tokens.delete({
			select: {
				id: true,
			},
			where: {
				token: token,
			}
		}).catch((e) => {
			if (e instanceof PrismaClientKnownRequestError) {
				switch (e.code) {
					case 'P2025':
						throw new UnauthorizedException("Invalid token");
				}
			}
			throw e;
		});
	}

	async logoutGlobally(userId: string): Promise<void> {
		await this.prisma.tokens.deleteMany({
			where: {
				userId: userId,
			}
		});
	}
}
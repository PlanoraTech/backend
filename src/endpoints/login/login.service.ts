import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { SecretService } from '@app/auth/secret/secret.service';
import { LoginDto } from './dto/login.dto';
import { Login } from './interfaces/Login';
import { User } from '@app/interfaces/User.interface';

@Injectable()
export class LoginService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly secretService: SecretService,
	) { }

	async loginByEmailAndPassword(loginDto: LoginDto): Promise<Login> {
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
				email: loginDto.email,
			},
		});
		if (await this.secretService.comparePassword(loginDto.password, user.password)) {
			let token: { token: string; } = await this.secretService.createToken(user.id, loginDto.rememberMe);
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
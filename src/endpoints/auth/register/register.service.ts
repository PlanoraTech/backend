import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { SecretService, TokenExpiry } from '../secret/secret.service';

@Injectable()
export class RegisterService {
	constructor(private readonly prisma: PrismaService) { }

	async create(registerDto: RegisterDto, tokenExpiry?: TokenExpiry): Promise<{ token: string; expiry: Date; }> {
		let user = await this.prisma.users.create({
			select: {
				id: true,
			},
			data: {
				email: registerDto.email,
				password: await SecretService.encryptPassword(registerDto.password),
			}
		}).catch(() => {
			throw new ConflictException('User already exists')
		});
		return await SecretService.createToken(user.id, tokenExpiry);
	}
}
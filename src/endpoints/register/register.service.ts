import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { SecretService } from '@app/auth/secret/secret.service';

@Injectable()
export class RegisterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly secretService: SecretService,
  ) {}

  async create(registerDto: RegisterDto): Promise<{ token: string }> {
    const user = await this.prisma.users
      .create({
        select: {
          id: true,
        },
        data: {
          email: registerDto.email,
          password: await this.secretService.encryptPassword(
            registerDto.password,
          ),
        },
      })
      .catch(() => {
        throw new ConflictException('User already exists');
      });
    return await this.secretService.createToken(user.id);
  }
}

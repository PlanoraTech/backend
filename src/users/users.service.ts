import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaClient) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAllUsers() {
    return `This action returns all users`;
  }

  async findOneUser(id: string, select?: {
    id?: boolean,
    email?: boolean,
    role?: boolean,
    institutions?: boolean,
    tokens?: boolean,
  }) {
    return await this.prisma.users.findUniqueOrThrow({
      select: {
        ...select,
        role: true,
      },
      where: {
        id,
      },
    })
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}

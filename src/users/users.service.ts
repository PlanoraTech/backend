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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string, select?: {
    name?: boolean,
    email?: boolean,
    role?: boolean,
    access?: boolean,
    institutions?: boolean,
    groups?: boolean,
    rooms?: boolean,
    subjects?: boolean,
    timetables?: boolean,
  }
  ) {
    return this.prisma.users.findUniqueOrThrow({
      select: {
        ...select,
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

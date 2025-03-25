import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Users } from '@prisma/client';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller()
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Post()
	create(@Param('institutionId') institutionId: string, @Body() userDto: UserDto): Promise<void> {
		return this.usersService.add(institutionId, userDto);
	}

	@Get()
	findAll(@Param('institutionId') institutionId: string): Promise<Partial<Users>[]> {
		return this.usersService.findAll(institutionId);
	}

	@Delete(':id')
	remove(@Param('institutionId') institutionId: string, @Param('id') id: string): Promise<void> {
		return this.usersService.remove(institutionId, id);
	}
}
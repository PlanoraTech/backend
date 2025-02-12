import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { Access, AccessTypes } from 'src/decorators/access.decorator';
import { Users } from '@prisma/client';

@Controller()
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Post()
	@Access(AccessTypes.PRIVATE)
	create(@Param('institutionId') institutionId: string, @Body() userDto: UserDto): Promise<void> {
		return this.usersService.add(institutionId, userDto);
	}

	@Get()
	@Access(AccessTypes.PRIVATE)
	findAll(@Param('institutionId') institutionId: string): Promise<Partial<Users>[]> {
		return this.usersService.findAll(institutionId, {
			email: true,
			role: true,
		});
	}

	@Delete(':id')
	@Access(AccessTypes.PRIVATE)
	remove(@Param('institutionId') institutionId: string, @Body() userDto: UserDto): Promise<void> {
		return this.usersService.remove(institutionId, userDto);
	}
}

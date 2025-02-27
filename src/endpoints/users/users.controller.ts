import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Users } from '@prisma/client';
import { UsersService } from './users.service';
import { Access, AccessTypes } from '@app/decorators/access.decorator';
import { UserDto } from './dto/user.dto';

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
		return this.usersService.findAll(institutionId);
	}

	@Delete(':id')
	@Access(AccessTypes.PRIVATE)
	remove(@Param('institutionId') institutionId: string, @Body() userDto: UserDto): Promise<void> {
		return this.usersService.remove(institutionId, userDto);
	}
}
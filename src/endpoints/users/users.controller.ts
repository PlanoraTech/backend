import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { Access, AccessTypes } from 'src/decorators/access.decorator';

@Controller()
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Post()
	@Access(AccessTypes.PRIVATE)
	create(@Param('institutionsId') institutionsId: string, @Body() userDto: UserDto) {
		return this.usersService.add(institutionsId, userDto);
	}

	@Get()
	@Access(AccessTypes.PRIVATE)
	findAll(@Param('institutionsId') institutionsId: string) {
		return this.usersService.findAll(institutionsId, {
			email: true,
			role: true,
		});
	}

	@Delete(':id')
	@Access(AccessTypes.PRIVATE)
	remove(@Param('institutionsId') institutionsId: string, @Body() userDto: UserDto): Promise<void> {
		return this.usersService.remove(institutionsId, userDto);
	}
}

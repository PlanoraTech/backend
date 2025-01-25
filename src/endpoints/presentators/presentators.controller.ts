import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PresentatorsService } from './presentators.service';
import { CreatePresentatorDto } from './dto/create-presentator.dto';
import { UpdatePresentatorDto } from './dto/update-presentator.dto';

@Controller()
export class PresentatorsController {
	constructor(private readonly presentatorsService: PresentatorsService) { }

	@Post()
	create(@Param('institutionsId') institutionsId: string, @Body() createPresentatorDto: CreatePresentatorDto) {
		return this.presentatorsService.create(institutionsId, createPresentatorDto);
	}

	@Get()
	findAll(@Param('institutionsId') institutionsId: string) {
		return this.presentatorsService.findAll(institutionsId, {
			name: true,
		});
	}

	@Get(':id')
	findOne(@Param('institutionsId') institutionsId: string, @Param('id') id: string) {
		return this.presentatorsService.findOne(institutionsId, id, {
			name: true,
		});
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updatePresentatorDto: UpdatePresentatorDto) {
		return this.presentatorsService.update(id, updatePresentatorDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.presentatorsService.remove(id);
	}
}
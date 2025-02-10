import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PresentatorsService } from './presentators.service';
import { CreatePresentatorDto } from './dto/create-presentator.dto';
import { UpdatePresentatorDto } from './dto/update-presentator.dto';
import { Access, AccessTypes } from 'src/decorators/access.decorator';
import { Presentators } from '@prisma/client';

@Controller()
export class PresentatorsController {
	constructor(private readonly presentatorsService: PresentatorsService) { }

	@Post()
	@Access(AccessTypes.PRIVATE)
	create(@Param('institutionsId') institutionsId: string, @Body() createPresentatorDto: CreatePresentatorDto) {
		return this.presentatorsService.create(institutionsId, createPresentatorDto);
	}

	@Get()
	@Access(AccessTypes.RESTRICTED)
	findAll(@Param('institutionsId') institutionsId: string): Promise<Partial<Presentators>[]> {
		return this.presentatorsService.findAll(institutionsId, {
			name: true,
		});
	}

	@Get(':id')
	@Access(AccessTypes.RESTRICTED)
	findOne(@Param('institutionsId') institutionsId: string, @Param('id') id: string): Promise<Partial<Presentators>> {
		return this.presentatorsService.findOne(institutionsId, id, {
			name: true,
		});
	}

	@Patch(':id')
	@Access(AccessTypes.PRIVATE)
	update(@Param('institutionsId') institutionsId: string, @Param('id') id: string, @Body() updatePresentatorDto: UpdatePresentatorDto) {
		return this.presentatorsService.update(institutionsId, id, updatePresentatorDto);
	}

	@Delete(':id')
	@Access(AccessTypes.PRIVATE)
	remove(@Param('institutionsId') institutionsId: string, @Param('id') id: string) {
		return this.presentatorsService.remove(institutionsId, id);
	}
}
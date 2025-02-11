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
	create(@Param('institutionId') institutionId: string, @Body() createPresentatorDto: CreatePresentatorDto) {
		return this.presentatorsService.create(institutionId, createPresentatorDto);
	}

	@Get()
	@Access(AccessTypes.RESTRICTED)
	findAll(@Param('institutionId') institutionId: string): Promise<Partial<Presentators>[]> {
		return this.presentatorsService.findAll(institutionId, {
			name: true,
		});
	}

	@Get(':id')
	@Access(AccessTypes.RESTRICTED)
	findOne(@Param('institutionId') institutionId: string, @Param('id') id: string): Promise<Partial<Presentators>> {
		return this.presentatorsService.findOne(institutionId, id, {
			name: true,
		});
	}

	@Patch(':id')
	@Access(AccessTypes.PRIVATE)
	update(@Param('institutionId') institutionId: string, @Param('id') id: string, @Body() updatePresentatorDto: UpdatePresentatorDto) {
		return this.presentatorsService.update(institutionId, id, updatePresentatorDto);
	}

	@Delete(':id')
	@Access(AccessTypes.PRIVATE)
	remove(@Param('institutionId') institutionId: string, @Param('id') id: string) {
		return this.presentatorsService.remove(institutionId, id);
	}
}
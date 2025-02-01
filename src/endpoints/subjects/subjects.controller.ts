import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Access, AccessTypes } from 'src/decorators/access.decorator';

@Controller()
export class SubjectsController {
	constructor(private readonly subjectsService: SubjectsService) { }

	@Post()
	@Access(AccessTypes.PRIVATE)
	create(@Param('institutionsId') institutionsId: string, @Body() createSubjectDto: CreateSubjectDto) {
		return this.subjectsService.create(institutionsId, createSubjectDto);
	}

	@Get()
	@Access(AccessTypes.RESTRICTED)
	findAll(@Param('institutionsId') institutionsId: string) {
		return this.subjectsService.findAll(institutionsId, {
			name: true,
			subjectId: true,
		});
	}

	@Get(':id')
	@Access(AccessTypes.RESTRICTED)
	findOne(@Param('institutionsId') institutionsId: string, @Param('id') id: string) {
		return this.subjectsService.findOne(institutionsId, id, {
			name: true,
			subjectId: true,
		});
	}

	@Patch(':id')
	@Access(AccessTypes.PRIVATE)
	update(@Param('institutionsId') institutionsId: string, @Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
		return this.subjectsService.update(institutionsId, id, updateSubjectDto);
	}

	@Delete(':id')
	@Access(AccessTypes.PRIVATE)
	remove(@Param('institutionsId') institutionsId: string, @Param('id') id: string) {
		return this.subjectsService.remove(institutionsId, id);
	}
}
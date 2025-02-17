import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Access, AccessTypes } from '../../decorators/access.decorator';
import { Subjects } from '@prisma/client';

@Controller()
export class SubjectsController {
	constructor(private readonly subjectsService: SubjectsService) { }

	@Post()
	@Access(AccessTypes.PRIVATE)
	create(@Param('institutionId') institutionId: string, @Body() createSubjectDto: CreateSubjectDto): Promise<void> {
		return this.subjectsService.create(institutionId, createSubjectDto);
	}

	@Get()
	@Access(AccessTypes.RESTRICTED)
	findAll(@Param('institutionId') institutionId: string): Promise<Partial<Subjects>[]> {
		return this.subjectsService.findAll(institutionId, {
			name: true,
			subjectId: true,
		});
	}

	@Get(':id')
	@Access(AccessTypes.RESTRICTED)
	findOne(@Param('institutionId') institutionId: string, @Param('id') id: string): Promise<Partial<Subjects>> {
		return this.subjectsService.findOne(institutionId, id, {
			name: true,
			subjectId: true,
		});
	}

	@Patch(':id')
	@Access(AccessTypes.PRIVATE)
	update(@Param('institutionId') institutionId: string, @Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto): Promise<void> {
		return this.subjectsService.update(institutionId, id, updateSubjectDto);
	}

	@Delete(':id')
	@Access(AccessTypes.PRIVATE)
	remove(@Param('institutionId') institutionId: string, @Param('id') id: string): Promise<void> {
		return this.subjectsService.remove(institutionId, id);
	}
}
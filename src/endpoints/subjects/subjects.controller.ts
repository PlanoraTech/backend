import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Controller([
  'institutions/:institutionsId/subjects'
])
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  findAll(@Param('institutionsId') institutionsId: string) {
    return this.subjectsService.findAll(institutionsId, {
      name: true,
      subjectId: true,
    });
  }

  @Get(':id')
  findOne(@Param('institutionsId') institutionsId: string, @Param('id') id: string) {
    return this.subjectsService.findOne(institutionsId, id, {
      name: true,
      subjectId: true,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(id);
  }
}

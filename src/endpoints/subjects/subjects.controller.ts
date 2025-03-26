import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { AccessType, Subjects } from '@prisma/client';
import { SubjectsService } from './subjects.service';
import { Access } from '@app/decorators/access.decorator';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Controller()
export class SubjectsController {
    constructor(private readonly subjectsService: SubjectsService) {}

    @Post()
    create(
        @Param('institutionId') institutionId: string,
        @Body() createSubjectDto: CreateSubjectDto,
    ): Promise<void> {
        return this.subjectsService.create(institutionId, createSubjectDto);
    }

    @Get()
    @Access(AccessType.PUBLIC)
    findAll(
        @Param('institutionId') institutionId: string,
    ): Promise<Subjects[]> {
        return this.subjectsService.findAll(institutionId);
    }

    @Get(':id')
    @Access(AccessType.PUBLIC)
    findOne(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
    ): Promise<Subjects> {
        return this.subjectsService.findOne(institutionId, id);
    }

    @Patch(':id')
    update(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
        @Body() updateSubjectDto: UpdateSubjectDto,
    ): Promise<void> {
        return this.subjectsService.update(institutionId, id, updateSubjectDto);
    }

    @Delete(':id')
    remove(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.subjectsService.remove(institutionId, id);
    }
}

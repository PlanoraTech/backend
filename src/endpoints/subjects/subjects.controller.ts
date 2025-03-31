import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOkResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AccessType, Subjects } from '@prisma/client';
import { SubjectsService } from './subjects.service';
import { Access } from '@app/decorators/access.decorator';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@ApiTags('Subjects')
@ApiBearerAuth()
@Controller()
export class SubjectsController {
    constructor(private readonly subjectsService: SubjectsService) {}

    /**
     * Create a new subject.
     *
     * @remarks This operation creates a new subject under a specified institution.
     */
    @Post()
    @ApiOkResponse({ description: 'Successfully created the subject.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to create a subject.',
    })
    create(
        @Param('institutionId') institutionId: string,
        @Body() createSubjectDto: CreateSubjectDto,
    ): Promise<void> {
        return this.subjectsService.create(institutionId, createSubjectDto);
    }

    /**
     * Retrieve all subjects for a given institution.
     *
     * @remarks This operation fetches all subjects associated with a specific institution.
     */
    @Get()
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({ description: 'Successfully retrieved all subjects.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access subjects.',
    })
    findAll(
        @Param('institutionId') institutionId: string,
    ): Promise<Subjects[]> {
        return this.subjectsService.findAll(institutionId);
    }

    /**
     * Retrieve a specific subject by ID.
     *
     * @remarks This operation fetches details of a particular subject.
     */
    @Get(':id')
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({ description: 'Successfully retrieved the subject.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access this subject.',
    })
    @ApiNotFoundResponse({
        description: 'Subject not found with the given ID.',
    })
    findOne(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
    ): Promise<Subjects> {
        return this.subjectsService.findOne(institutionId, id);
    }

    /**
     * Update a subject's details.
     *
     * @remarks This operation updates the details of a specific subject.
     */
    @Patch(':id')
    @ApiOkResponse({ description: 'Successfully updated the subject.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to update this subject.',
    })
    @ApiNotFoundResponse({
        description: 'Subject not found with the given ID.',
    })
    update(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
        @Body() updateSubjectDto: UpdateSubjectDto,
    ): Promise<void> {
        return this.subjectsService.update(institutionId, id, updateSubjectDto);
    }

    /**
     * Remove a subject.
     *
     * @remarks This operation deletes a specific subject.
     */
    @Delete(':id')
    @ApiOkResponse({ description: 'Successfully removed the subject.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to remove this subject.',
    })
    @ApiNotFoundResponse({
        description: 'Subject not found with the given ID.',
    })
    remove(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.subjectsService.remove(institutionId, id);
    }
}

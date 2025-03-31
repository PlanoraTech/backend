import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOkResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AccessType, Institutions } from '@prisma/client';
import { InstitutionsService } from './institutions.service';
import { Access } from '@app/decorators/access.decorator';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@ApiTags('Institutions')
@ApiBearerAuth()
@Controller()
export class InstitutionsController {
    constructor(private readonly institutionsService: InstitutionsService) {}

    /**
     * Retrieve all institutions
     *
     * @remarks This operation fetches all available institutions.
     */
    @Get()
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({ description: 'Successfully retrieved all institutions.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access these institutions.',
    })
    findAll(): Promise<Institutions[]> {
        return this.institutionsService.findAll();
    }

    /**
     * Retrieve a specific institution by ID
     *
     * @remarks This operation fetches the details of a particular institution.
     */
    @Get(':institutionId')
    @Access(AccessType.PUBLIC)
    @ApiOkResponse({ description: 'Successfully retrieved the institution.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access this institution.',
    })
    @ApiNotFoundResponse({
        description: 'Institution not found with the given ID.',
    })
    findOne(@Param('institutionId') id: string): Promise<Institutions> {
        return this.institutionsService.findOne(id);
    }

    /**
     * Update an existing institution
     *
     * @remarks This operation modifies the details of an existing institution.
     */
    @Patch(':id')
    @ApiOkResponse({ description: 'Successfully updated the institution.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to update this institution.',
    })
    @ApiNotFoundResponse({
        description: 'Institution not found with the given ID.',
    })
    update(
        @Param('id') id: string,
        @Body() updateInstitutionDto: UpdateInstitutionDto,
    ): Promise<void> {
        return this.institutionsService.update(id, updateInstitutionDto);
    }
}

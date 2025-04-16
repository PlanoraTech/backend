import { Controller, Get, Param } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOkResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Permissions, Prisma, SpecialPermissions } from '@prisma/client';
import {
    substitutionsSelect,
    SubstitutionsService,
} from './substitutions.service';
import { Permission } from '@app/decorators/permission.decorator';
import { SpecialPermission } from '@app/decorators/specialPermission.decorator';

@ApiTags('Substitutions')
@ApiBearerAuth()
@Controller()
export class SubstitutionsController {
    constructor(private readonly substitutionsService: SubstitutionsService) {}

    /**
     * Retrieve all substitutions for a given institution and substitute presentator.
     *
     * @remarks This operation fetches all substitutions associated with a substitute presentator.
     */
    @Get()
    @Permission([Permissions.READ])
    @SpecialPermission([SpecialPermissions.SUBSTITUTE])
    @ApiOkResponse({ description: 'Successfully retrieved all substitutions.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to view substitutions.',
    })
    @ApiNotFoundResponse({
        description: 'Institution or presentator not found.',
    })
    findAll(
        @Param('institutionId') institutionId: string,
        @Param('substitutePresentatorId') presentatorId: string,
    ): Promise<
        Prisma.SubstitutionsGetPayload<{
            select: typeof substitutionsSelect;
        }>[]
    > {
        return this.substitutionsService.findAll(institutionId, presentatorId);
    }

    /**
     * Retrieve a specific substitution by ID.
     *
     * @remarks This operation fetches details of a particular substitution.
     */
    @Get(':id')
    @Permission([Permissions.READ])
    @SpecialPermission([SpecialPermissions.SUBSTITUTE])
    @ApiOkResponse({ description: 'Successfully retrieved the substitution.' })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access this substitution.',
    })
    @ApiNotFoundResponse({
        description: 'Substitution not found with the given ID.',
    })
    findOne(
        @Param('institutionId') institutionId: string,
        @Param('substitutePresentatorId') presentatorId: string,
        @Param('id') id: string,
    ): Promise<
        Prisma.SubstitutionsGetPayload<{
            select: typeof substitutionsSelect;
        }>
    > {
        return this.substitutionsService.findOne(
            institutionId,
            presentatorId,
            id,
        );
    }
}

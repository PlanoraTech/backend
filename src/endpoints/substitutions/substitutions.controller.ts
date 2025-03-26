import { Controller, Get, Param } from '@nestjs/common';
import { Permissions, SpecialPermissions, Substitutions } from '@prisma/client';
import { SubstitutionsService } from './substitutions.service';
import { Permission } from '@app/decorators/permission.decorator';
import { SpecialPermission } from '@app/decorators/specialPermission.decorator';

@Controller()
export class SubstitutionsController {
  constructor(private readonly substitutionsService: SubstitutionsService) {}

  @Get()
  @Permission([Permissions.READ])
  @SpecialPermission([SpecialPermissions.SUBSTITUTE])
  findAll(
    @Param('institutionId') institutionId: string,
    @Param('substitutePresentatorId') presentatorId: string,
  ): Promise<Substitutions[]> {
    return this.substitutionsService.findAll(institutionId, presentatorId);
  }

  @Get(':id')
  @Permission([Permissions.READ])
  @SpecialPermission([SpecialPermissions.SUBSTITUTE])
  findOne(
    @Param('institutionId') institutionId: string,
    @Param('substitutePresentatorId') presentatorId: string,
    @Param('id') id: string,
  ): Promise<Substitutions> {
    return this.substitutionsService.findOne(institutionId, presentatorId, id);
  }
}

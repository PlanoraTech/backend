import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { AccessType, Institutions } from '@prisma/client';
import { InstitutionsService } from './institutions.service';
import { Access } from '@app/decorators/access.decorator';
import { Permissions } from '@app/decorators/permissions.decorator';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Controller()
export class InstitutionsController {
	constructor(private readonly institutionsService: InstitutionsService) { }

	@Get()
	@Access(AccessType.PUBLIC)
	@Permissions([])
	findAll(): Promise<Institutions[]> {
		return this.institutionsService.findAll();
	}

	@Get(':institutionId')
	@Access(AccessType.PUBLIC)
	findOne(@Param('institutionId') id: string): Promise<Institutions> {
		return this.institutionsService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateInstitutionDto: UpdateInstitutionDto): Promise<void> {
		return this.institutionsService.update(id, updateInstitutionDto);
	}
}
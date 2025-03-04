import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { Access, AccessTypes } from '@app/decorators/access.decorator';
import { Institutions } from '@prisma/client';

@Controller()
export class InstitutionsController {
	constructor(private readonly institutionsService: InstitutionsService) { }

	/*
	@Post()
	@Access(AccessTypes.ADMIN)
	create(@Body() createInstitutionDto: CreateInstitutionDto): Promise<void> {
		return this.institutionsService.create(createInstitutionDto);
	}
	*/

	@Get()
	findAll(): Promise<Institutions[]> {
		return this.institutionsService.findAll();
	}

	@Get(':institutionId')
	@Access(AccessTypes.RESTRICTED)
	findOne(@Param('institutionId') id: string): Promise<Institutions> {
		return this.institutionsService.findOne(id);
	}

	@Patch(':id')
	@Access(AccessTypes.PRIVATE)
	update(@Param('id') id: string, @Body() updateInstitutionDto: UpdateInstitutionDto): Promise<void> {
		return this.institutionsService.update(id, updateInstitutionDto);
	}

	/*
	@Delete(':id')
	@Access(AccessTypes.ADMIN)
	remove(@Param('id') id: string): Promise<void> {
		return this.institutionsService.remove(id);
	}
	*/
}
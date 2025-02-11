import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { Access, AccessTypes } from 'src/decorators/access.decorator';
import { Institutions } from '@prisma/client';

@Controller()
export class InstitutionsController {
	constructor(private readonly institutionsService: InstitutionsService) { }

	/*
	@Post()
	@Access(AccessTypes.ADMIN)
	create(@Body() createInstitutionDto: CreateInstitutionDto) {
		return this.institutionsService.create(createInstitutionDto);
	}
	*/

	@Get()
	findAll(): Promise<Partial<Institutions>[]> {
		return this.institutionsService.findAll({
			name: true,
			type: true,
			access: true,
			color: true,
			website: true,
		});
	}

	@Get(':institutionId')
	@Access(AccessTypes.RESTRICTED)
	findOne(@Param('institutionId') id: string): Promise<Partial<Institutions>> {
		return this.institutionsService.findOne(id, {
			name: true,
			type: true,
			color: true,
			website: true,
		});
	}

	@Patch(':id')
	@Access(AccessTypes.PRIVATE)
	update(@Param('id') id: string, @Body() updateInstitutionDto: UpdateInstitutionDto) {
		return this.institutionsService.update(id, updateInstitutionDto);
	}

	/*
	@Delete(':id')
	@Access(AccessTypes.ADMIN)
	remove(@Param('id') id: string) {
		return this.institutionsService.remove(id);
	}
	*/
}
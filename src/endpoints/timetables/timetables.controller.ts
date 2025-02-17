import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateTimeTableDto } from './dto/create-timetable.dto';
import { UpdateTimeTableDto } from './dto/update-timetable.dto';
import { TimeTablesService } from './timetables.service';
import { Access, AccessTypes } from '../../decorators/access.decorator';
import { TimeTables } from '@prisma/client';

@Controller()
export class TimeTablesController {
	constructor(private readonly timetablesService: TimeTablesService) { }

	@Post()
	@Access(AccessTypes.PRIVATE)
	create(@Param('institutionId') institutionId: string, @Body() createTimetableDto: CreateTimeTableDto): Promise<void> {
		return this.timetablesService.create(institutionId, createTimetableDto);
	}

	@Get()
	@Access(AccessTypes.RESTRICTED)
	findAll(@Param('institutionId') institutionId: string): Promise<Partial<TimeTables>[]> {
		return this.timetablesService.findAll(institutionId, {
			name: true,
		});
	}

	@Get(':id')
	@Access(AccessTypes.RESTRICTED)
	findOne(@Param('institutionId') institutionId: string, @Param('id') id: string): Promise<Partial<TimeTables>> {
		return this.timetablesService.findOne(institutionId, id, {
			name: true,
		});
	}

	@Patch(':id')
	@Access(AccessTypes.PRIVATE)
	update(@Param('institutionId') institutionId: string, @Param('id') id: string, @Body() updateTimetableDto: UpdateTimeTableDto): Promise<void> {
		return this.timetablesService.update(institutionId, id, updateTimetableDto);
	}

	@Delete(':id')
	@Access(AccessTypes.PRIVATE)
	remove(@Param('institutionId') institutionId: string, @Param('id') id: string): Promise<void> {
		return this.timetablesService.remove(institutionId, id);
	}
}
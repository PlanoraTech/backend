import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateTimeTableDto } from './dto/create-timetable.dto';
import { UpdateTimeTableDto } from './dto/update-timetable.dto';
import { TimeTablesService } from './timetables.service';
import { ExtendedTimeTables } from './types/timetables.type';
import { Access, AccessTypes } from 'src/decorators/access.decorator';

@Controller()
export class TimeTablesController {
	constructor(private readonly timetablesService: TimeTablesService) { }

	@Post()
	@Access(AccessTypes.PRIVATE)
	create(@Param('institutionsId') institutionsId: string, @Body() createTimetableDto: CreateTimeTableDto) {
		return this.timetablesService.create(institutionsId, createTimetableDto);
	}

	@Get()
	@Access(AccessTypes.RESTRICTED)
	findAll(@Param('institutionsId') institutionsId: string): Promise<Partial<ExtendedTimeTables>[]> {
		return this.timetablesService.findAll(institutionsId, {
			name: true,
			events: {
				select: {
					id: true,
					title: true,
					date: true,
				}
			},
		});
	}

	@Get(':id')
	@Access(AccessTypes.RESTRICTED)
	findOne(@Param('institutionsId') institutionsId: string, @Param('id') id: string): Promise<Partial<ExtendedTimeTables>> {
		return this.timetablesService.findOne(institutionsId, id, {
			name: true,
			events: {
				select: {
					id: true,
					title: true,
					date: true,
				}
			},
		});
	}

	@Patch(':id')
	@Access(AccessTypes.PRIVATE)
	update(@Param('institutionsId') institutionsId: string, @Param('id') id: string, @Body() updateTimetableDto: UpdateTimeTableDto) {
		return this.timetablesService.update(institutionsId, id, updateTimetableDto);
	}

	@Delete(':id')
	@Access(AccessTypes.PRIVATE)
	remove(@Param('institutionsId') institutionsId: string, @Param('id') id: string) {
		return this.timetablesService.remove(institutionsId, id);
	}
}
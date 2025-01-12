import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TimeTablesService } from './timetables.service';
import { CreateTimeTableDto } from './dto/create-timetable.dto';
import { UpdateTimeTableDto } from './dto/update-timetable.dto';

@Controller()
export class TimeTablesController {
  constructor(private readonly timetablesService: TimeTablesService) {}

  @Post()
  create(@Body() createTimetableDto: CreateTimeTableDto) {
    return this.timetablesService.create(createTimetableDto);
  }

  @Get()
  findAll(@Param('institutionsId') institutionsId: string) {
    return this.timetablesService.findAll(institutionsId, {
      id: true,
      group: true,
      appointments: true,
    });
  }

  @Get(':id')
  findOne(@Param('institutionsId') institutionsId: string, @Param('id') id: string) {
    return this.timetablesService.findOne(institutionsId, id, {
      group: true,
      appointments: true,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTimetableDto: UpdateTimeTableDto) {
    return this.timetablesService.update(id, updateTimetableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timetablesService.remove(id);
  }
}

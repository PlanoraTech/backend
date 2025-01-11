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
  findAll() {
    return this.timetablesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timetablesService.findOne(id);
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

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateTimeTableDto } from './dto/create-timetable.dto';
import { UpdateTimeTableDto } from './dto/update-timetable.dto';
import { TimeTablesFromGroupsService, TimeTablesFromInstitutionsService } from './timetables.service';

@Controller([
  'institutions/:institutionsId/timetables',
])
export class TimeTablesFromInstitutionsController {
  constructor(private readonly timetablesService: TimeTablesFromInstitutionsService) { }

  @Post()
  create(@Body() createTimetableDto: CreateTimeTableDto) {
    return this.timetablesService.create(createTimetableDto);
  }

  @Get()
  findAll(@Param('institutionsId') institutionsId: string) {
    return this.timetablesService.findAll(institutionsId, {
      select: {
        name: true,
        groups: true,
      }
    });
  }

  @Get(':id')
  findOne(@Param('institutionsId') institutionsId: string, @Param('id') id: string) {
    return this.timetablesService.findOne(institutionsId, id, {
      select: {
        name: true,
        groups: true,
      }
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

@Controller([
  'institutions/:institutionsId/groups/:groupsId/timetables'
])
export class TimeTablesFromGroupsController {
  constructor(private readonly timetablesService: TimeTablesFromGroupsService) { }

  @Post()
  create(@Body() createTimetableDto: CreateTimeTableDto) {
    return this.timetablesService.create(createTimetableDto);
  }

  @Get()
  findAll(@Param('institutionsId') institutionsId: string, @Param('groupsId') groupsId: string) {
    return this.timetablesService.findAll(institutionsId, {
      groupsId: groupsId,
      select: {
        name: true,
      }
    });
  }

  @Get(':id')
  findOne(@Param('institutionsId') institutionsId: string, @Param('id') id: string, @Param('groupsId') groupsId: string) {
    return this.timetablesService.findOne(institutionsId, id, {
      groupsId: groupsId,
      select: {
        name: true,
      }
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
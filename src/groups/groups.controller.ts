import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  findAll(@Param('institutionsId') institutionsId: string) {
    return this.groupsService.findAll(institutionsId, {
      name: true,
      timetables: {
        select: {
          id: true,
          name: true,
          groups: true,
          appointments: {
            select: {
              id: true,
              subject: true,
              presentators: true,
              rooms: true,
              dayOfWeek: true,
              start: true,
              end: true,
              isCancelled: true,
              timetables: true,
            },
          },
          institution: true,
        },
      }
    });
  }

  @Get(':id')
  findOne(@Param('institutionsId') institutionsId: string, @Param('id') id: string) {
    return this.groupsService.findOne(institutionsId, id, {
      name: true,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}

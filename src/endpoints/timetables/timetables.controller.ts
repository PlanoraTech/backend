import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccessType, TimeTables } from '@prisma/client';
import {
  TimeTablesFromAppointmentsService,
  TimeTablesService,
} from './timetables.service';
import { Access } from '@app/decorators/access.decorator';
import { CreateTimeTableDto } from './dto/create-timetable.dto';
import { UpdateTimeTableDto } from './dto/update-timetable.dto';

@Controller('timetables')
export class TimeTablesController {
  constructor(private readonly timetablesService: TimeTablesService) {}

  @Post()
  create(
    @Param('institutionId') institutionId: string,
    @Body() createTimetableDto: CreateTimeTableDto,
  ): Promise<void> {
    return this.timetablesService.create(institutionId, createTimetableDto);
  }

  @Get()
  @Access(AccessType.PUBLIC)
  findAll(
    @Param('institutionId') institutionId: string,
  ): Promise<TimeTables[]> {
    return this.timetablesService.findAll(institutionId);
  }

  @Get(':id')
  @Access(AccessType.PUBLIC)
  findOne(
    @Param('institutionId') institutionId: string,
    @Param('id') id: string,
  ): Promise<TimeTables> {
    return this.timetablesService.findOne(institutionId, id);
  }

  @Patch(':id')
  update(
    @Param('institutionId') institutionId: string,
    @Param('id') id: string,
    @Body() updateTimetableDto: UpdateTimeTableDto,
  ): Promise<void> {
    return this.timetablesService.update(institutionId, id, updateTimetableDto);
  }

  @Delete(':id')
  remove(
    @Param('institutionId') institutionId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.timetablesService.remove(institutionId, id);
  }
}

@Controller([
  'timetables/:timetableId/appointments/:appointmentId/timetables',
  'presentators/:presentatorId/appointments/:appointmentId/timetables',
  'rooms/:roomId/appointments/:appointmentId/timetables',
])
export class TimeTablesFromAppointmentsController {
  constructor(
    private readonly timetablesService: TimeTablesFromAppointmentsService,
  ) {}

  @Post(':id')
  add(
    @Param('institutionId') institutionId: string,
    @Param('timetableId') timetableId: string,
    @Param('presentatorId') presentatorId: string,
    @Param('roomId') roomId: string,
    @Param('appointmentId') appointmentId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.timetablesService.add(
      institutionId,
      {
        timetableId: timetableId,
        presentatorId: presentatorId,
        roomId: roomId,
        appointmentId: appointmentId,
      },
      id,
    );
  }

  @Get()
  @Access(AccessType.PUBLIC)
  findAll(
    @Param('institutionId') institutionId: string,
    @Param('timetableId') timetableId: string,
    @Param('presentatorId') presentatorId: string,
    @Param('roomId') roomId: string,
    @Param('appointmentId') appointmentId: string,
  ): Promise<TimeTables[]> {
    return this.timetablesService.findAll(institutionId, {
      timetableId: timetableId,
      presentatorId: presentatorId,
      roomId: roomId,
      appointmentId: appointmentId,
    });
  }

  @Get(':id')
  @Access(AccessType.PUBLIC)
  findOne(
    @Param('institutionId') institutionId: string,
    @Param('timetableId') timetableId: string,
    @Param('presentatorId') presentatorId: string,
    @Param('roomId') roomId: string,
    @Param('appointmentId') appointmentId: string,
    @Param('id') id: string,
  ): Promise<TimeTables> {
    return this.timetablesService.findOne(
      institutionId,
      {
        timetableId: timetableId,
        presentatorId: presentatorId,
        roomId: roomId,
        appointmentId: appointmentId,
      },
      id,
    );
  }

  @Delete(':id')
  remove(
    @Param('institutionId') institutionId: string,
    @Param('timetableId') timetableId: string,
    @Param('presentatorId') presentatorId: string,
    @Param('roomId') roomId: string,
    @Param('appointmentId') appointmentId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.timetablesService.add(
      institutionId,
      {
        timetableId: timetableId,
        presentatorId: presentatorId,
        roomId: roomId,
        appointmentId: appointmentId,
      },
      id,
    );
  }
}

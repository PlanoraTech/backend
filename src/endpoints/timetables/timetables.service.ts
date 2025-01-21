import { Injectable } from '@nestjs/common';
import { CreateTimeTableDto } from './dto/create-timetable.dto';
import { UpdateTimeTableDto } from './dto/update-timetable.dto';
import { InstitutionsService } from 'src/endpoints/institutions/institutions.service';

@Injectable()
export class TimeTablesService {
  constructor(private institutionsService: InstitutionsService) { }
  create(createTimetableDto: CreateTimeTableDto) {
    return 'This action adds a new timetable';
  }

  async findAll(institutionsId: string, select?: {
    name?: boolean,
    groups?: boolean,
    appointments?: {
      select: {
        id?: boolean,
        subject?: boolean,
        presentators?: boolean,
        rooms?: boolean,
        dayOfWeek?: boolean,
        start?: boolean,
        end?: boolean,
        isCancelled?: boolean,
        timetables?: boolean,
      },
    },
    institution?: boolean,
  }) {
    return (await this.institutionsService.findOne(institutionsId, {
      timetables: {
        select: {
          id: true,
          ...select,
        },
      },
    })).timetables;
  }

  async findOne(institutionsId: string, id: string, select?: {
    name?: boolean,
    groups?: boolean,
    appointments?: {
      select: {
        id?: boolean,
        subject?: boolean,
        presentators?: boolean,
        rooms?: boolean,
        dayOfWeek?: boolean,
        start?: boolean,
        end?: boolean,
        isCancelled?: boolean,
        timetables?: boolean,
      },
    },
    institution?: boolean,
  }) {
    return (await this.institutionsService.findOne(institutionsId, {
      timetables: {
        select: {
          id: true,
          ...select,
        },
      },
    })).timetables.find((timetable) => timetable.id === id);
  }

  update(id: string, updateTimetableDto: UpdateTimeTableDto) {
    return `This action updates a #${id} timetable`;
  }

  remove(id: string) {
    return `This action removes a #${id} timetable`;
  }
}

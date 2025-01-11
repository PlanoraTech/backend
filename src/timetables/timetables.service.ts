import { Injectable } from '@nestjs/common';
import { CreateTimeTableDto } from './dto/create-timetable.dto';
import { UpdateTimeTableDto } from './dto/update-timetable.dto';

@Injectable()
export class TimeTablesService {
  create(createTimetableDto: CreateTimeTableDto) {
    return 'This action adds a new timetable';
  }

  findAll() {
    return `This action returns all timetables`;
  }

  findOne(id: string) {
    return `This action returns a #${id} timetable`;
  }

  update(id: string, updateTimetableDto: UpdateTimeTableDto) {
    return `This action updates a #${id} timetable`;
  }

  remove(id: string) {
    return `This action removes a #${id} timetable`;
  }
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeTableDto } from './create-timetable.dto';

export class UpdateTimeTableDto extends PartialType(CreateTimeTableDto) {}

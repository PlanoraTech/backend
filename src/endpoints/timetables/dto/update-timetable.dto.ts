import { PartialType } from '@nestjs/swagger';
import { CreateTimeTableDto } from './create-timetable.dto';

export class UpdateTimeTableDto extends PartialType(CreateTimeTableDto) {}

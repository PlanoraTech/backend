import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  MinDate,
  Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsAfterOrEqual } from '@app/validators/isAfterOrEqual.validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date())
  start: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date())
  @Validate(IsAfterOrEqual, ['start'])
  end: Date;

  @IsBoolean()
  isCancelled: boolean;

  @IsNotEmpty()
  @IsString()
  subjectId: string;
}

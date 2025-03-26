import { IsDate, IsNotEmpty, IsString, Length, MinDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 128)
  title: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date())
  date: Date;
}

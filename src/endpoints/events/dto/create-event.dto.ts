import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString, Length, MinDate } from "class-validator";

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 128)
    title: string;

    @Type(() => Date)
    @IsDate()
    @MinDate(new Date())
    date: Date;
}
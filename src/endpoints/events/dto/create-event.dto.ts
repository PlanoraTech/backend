import { IsDate, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 128)
    title: string;

    @IsDate()
    date: Date;
}
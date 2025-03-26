import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTimeTableDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}

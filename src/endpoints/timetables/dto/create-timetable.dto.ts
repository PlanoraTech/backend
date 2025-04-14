import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTimeTableDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    version?: string;
}

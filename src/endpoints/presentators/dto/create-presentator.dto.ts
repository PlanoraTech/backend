import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreatePresentatorDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    email?: string;
}
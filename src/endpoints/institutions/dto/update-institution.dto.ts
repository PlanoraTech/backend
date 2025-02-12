import { IsString, IsNotEmpty } from "class-validator";

export class UpdateInstitutionDto {
    @IsString()
    @IsNotEmpty()
    color: string;

    @IsString()
    @IsNotEmpty()
    website: string;
}
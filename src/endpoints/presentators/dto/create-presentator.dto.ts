import { IsString, IsNotEmpty } from "class-validator";

export class CreatePresentatorDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    email?: string;
}

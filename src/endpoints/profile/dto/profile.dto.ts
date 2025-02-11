import { IsNotEmpty, IsString } from "class-validator";

export class ProfileDto {
    @IsString()
    @IsNotEmpty()
    token: string;
}

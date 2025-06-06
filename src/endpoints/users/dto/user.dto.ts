import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 128)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,128}$/,
        {
            message:
                'Password too weak. Must contain at least one uppercase letter, one lowercase letter, one number, and at least one of the following special characters: @, $, !, %, *, ?, &, #.',
        },
    )
    newPassword: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty()
    expoPushToken: string;
}

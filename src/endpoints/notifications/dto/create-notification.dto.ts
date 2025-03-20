import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z\d]{8}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{12}$/i, {
        message: "Expo push token must be a valid UUID"
    })
    expoPushToken: string;
}

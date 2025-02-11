import { IsArray, IsBoolean, IsDate, IsObject } from "class-validator";

export class CreateAppointmentDto {
    @IsDate()
    start: Date;

    @IsDate()
    end: Date;

    @IsBoolean()
    isCancelled: boolean;

    @IsObject()
    subject: {
        id: string,
    };

    @IsArray()
    presentators: {
        id: string,
        isSubstituted: boolean,
    }[];

    @IsArray()
    rooms: {
        id: string,
    }[];
}

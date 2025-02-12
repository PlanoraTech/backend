import { IsBoolean, IsDate, IsString } from "class-validator";

export class CreateAppointmentDto {
    @IsDate()
    start: Date;

    @IsDate()
    end: Date;

    @IsBoolean()
    isCancelled: boolean;

    @IsString()
    subjectId: string;
}

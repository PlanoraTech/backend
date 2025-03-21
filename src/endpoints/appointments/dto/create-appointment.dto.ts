import { IsBoolean, IsDate, IsString, MinDate, Validate } from "class-validator";
import { Type } from "class-transformer";
import { IsAfterOrEqual } from "@app/validators/isAfterOrEqual.validator";

export class CreateAppointmentDto {
    @Type(() => Date)
    @IsDate()
    @MinDate(new Date())
    start: Date;
    
    @Type(() => Date)
    @IsDate()
    @MinDate(new Date())
    @Validate(IsAfterOrEqual, ['start'])
    end: Date;

    @IsBoolean()
    isCancelled: boolean;

    @IsString()
    subjectId: string;
}

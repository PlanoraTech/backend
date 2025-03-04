import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsString, MinDate, Validate } from "class-validator";
import { IsBeforeConstraint } from "@app/validators/IsBefore.validator";

export class CreateAppointmentDto {
    @Type(() => Date)
    @IsDate()
    @MinDate(new Date())
    @Validate(IsBeforeConstraint, ['end'])
    start: Date;

    @Type(() => Date)
    @IsDate()
    @MinDate(new Date())
    end: Date;

    @IsBoolean()
    isCancelled: boolean;

    @IsString()
    subjectId: string;
}

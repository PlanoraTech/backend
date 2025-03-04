import { IsBeforeConstraint } from "@app/validators/IsBefore.validator";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, MinDate, Validate } from "class-validator";

export class UpdateSubstitutionDto {
    @IsBoolean()
    isSubstituted: boolean;
}

export class UpdateSubstitutionsDto extends UpdateSubstitutionDto {
    @Type(() => Date)
    @IsDate()
    @MinDate(new Date())
    @Validate(IsBeforeConstraint, ['to'])
    from: Date;

    @Type(() => Date)
    @IsDate()
    @MinDate(new Date())
    to: Date;
}
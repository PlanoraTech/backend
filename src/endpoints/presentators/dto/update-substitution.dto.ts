import { IsBoolean, IsDate, MinDate, Validate } from "class-validator";
import { Type } from "class-transformer";
import { IsAfterOrEqual } from "@app/validators/isAfterOrEqual.validator";

export class UpdateSubstitutionDto {
    @IsBoolean()
    isSubstituted: boolean;
}

export class UpdateSubstitutionsDto extends UpdateSubstitutionDto {
    @Type(() => Date)
    @IsDate()
    @MinDate(new Date())
    from: Date;
    
    @Type(() => Date)
    @IsDate()
    @MinDate(new Date())
    @Validate(IsAfterOrEqual, ['from'])
    to: Date;
}
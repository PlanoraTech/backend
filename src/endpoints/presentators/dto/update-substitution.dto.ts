import {
    IsBoolean,
    IsDate,
    IsNotEmpty,
    MinDate,
    Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsAfterOrEqual } from '@app/validators/isAfterOrEqual.validator';

export class UpdateSubstitutionDto {
    @IsBoolean()
    isSubstituted: boolean;
}

export class UpdateSubstitutionsDto extends UpdateSubstitutionDto {
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    @MinDate(new Date())
    from: Date;

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    @MinDate(new Date())
    @Validate(IsAfterOrEqual, ['from'])
    to: Date;
}

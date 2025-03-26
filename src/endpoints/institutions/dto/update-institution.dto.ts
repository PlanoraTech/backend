import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateInstitutionDto {
  @IsString()
  @IsNotEmpty()
  website: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMassDto {
    @IsNotEmpty()
    @IsString()
    id: string;
}

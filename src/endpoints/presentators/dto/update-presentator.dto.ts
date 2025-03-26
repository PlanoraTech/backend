import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePresentatorDto {
    @IsNotEmpty()
    @IsString()
    id: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreatePresentatorDto } from './create-presentator.dto';

export class UpdatePresentatorDto extends PartialType(CreatePresentatorDto) {}
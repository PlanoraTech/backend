import { Injectable } from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';

@Injectable()
export class RegisterService {
  create(createRegisterDto: CreateRegisterDto) {
    return ;
  }
}

import { Injectable } from '@nestjs/common';
import { CreatePresentatorDto } from './dto/create-presentator.dto';
import { UpdatePresentatorDto } from './dto/update-presentator.dto';

@Injectable()
export class PresentatorsService {
  create(createPresentatorDto: CreatePresentatorDto) {
    return 'This action adds a new presentator';
  }

  findAll() {
    return `This action returns all presentators`;
  }

  findOne(id: number) {
    return `This action returns a #${id} presentator`;
  }

  update(id: number, updatePresentatorDto: UpdatePresentatorDto) {
    return `This action updates a #${id} presentator`;
  }

  remove(id: number) {
    return `This action removes a #${id} presentator`;
  }
}

import { Injectable } from '@nestjs/common';
import { CreatePresentatorDto } from './dto/create-presentator.dto';
import { UpdatePresentatorDto } from './dto/update-presentator.dto';
import { InstitutionsService } from 'src/institutions/institutions.service';

@Injectable()
export class PresentatorsService {
  constructor(private institutionsService: InstitutionsService) {}
  create(createPresentatorDto: CreatePresentatorDto) {
    return 'This action adds a new presentator';
  }

  async findAll(institutionsId: string, select?: {
    id?: boolean,
    name?: boolean,
    appointments?: boolean,
    institution?: boolean,
  }) {
    return (await this.institutionsService.findOne(institutionsId, {
      presentators: {
        select: {
          ...select,
        }
      },
    })).presentators;
  }

  async findOne(institutionsId: string, id: string, select?: {
    name?: boolean,
    appointments?: boolean,
    institution?: boolean,
  }) {
    return (await this.institutionsService.findOne(institutionsId, {
      presentators: {
        select: {
          id: true,
          ...select,
        }
      },
    })).presentators.find((presentator) => presentator.id === id);
  }

  update(id: number, updatePresentatorDto: UpdatePresentatorDto) {
    return `This action updates a #${id} presentator`;
  }

  remove(id: number) {
    return `This action removes a #${id} presentator`;
  }
}

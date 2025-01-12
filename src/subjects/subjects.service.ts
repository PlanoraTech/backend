import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InstitutionsService } from 'src/institutions/institutions.service';

@Injectable()
export class SubjectsService {
  constructor(private institutionsService: InstitutionsService) {}
  create(createSubjectDto: CreateSubjectDto) {
    return 'This action adds a new subject';
  }

  async findAll(institutionsId: string) {
    return (await this.institutionsService.findOne(institutionsId, {
      subjects: true,
    })).subjects;
  }

  async findOne(institutionsId: string, id: string) {
    return (await this.institutionsService.findOne(institutionsId, {
      subjects: true,
    })).subjects.find((subject) => subject.id === id);
  }

  update(id: string, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`;
  }

  remove(id: string) {
    return `This action removes a #${id} subject`;
  }
}

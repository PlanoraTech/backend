import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InstitutionsService } from 'src/institutions/institutions.service';

@Injectable()
export class GroupsService {
  constructor(private institutionsService: InstitutionsService) {}
  create(createGroupDto: CreateGroupDto) {
    
  }

  async findAll(institutionsId: string) {
    return (await this.institutionsService.findOne(institutionsId, {
      groups: true,
    })).groups;
  }

  async findOne(institutionsId: string, id: string) {
    return (await this.institutionsService.findOne(institutionsId, {
      groups: true,
    })).groups.find((group) => group.id === id);
  }

  update(id: string, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: string) {
    return `This action removes a #${id} group`;
  }
}

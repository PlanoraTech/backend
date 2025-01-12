import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InstitutionsService } from 'src/institutions/institutions.service';

@Injectable()
export class RoomsService {
  constructor(private institutionsService: InstitutionsService) {}
  create(createRoomDto: CreateRoomDto) {
    return 'This action adds a new room';
  }

  async findAll(institutionsId: string) {
    return (await this.institutionsService.findOne(institutionsId, {
      rooms: true,
    })).rooms;
  }

  async findOne(institutionsId: string, id: string) {
    return (await this.institutionsService.findOne(institutionsId, {
      rooms: true,
    })).rooms.find((room) => room.id === id);
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}

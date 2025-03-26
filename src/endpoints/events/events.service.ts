import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Events } from '@prisma/client';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    institutionId: string,
    createEventDto: CreateEventDto,
  ): Promise<void> {
    await this.prisma.events.create({
      data: {
        ...createEventDto,
        institutionId: institutionId,
      },
    });
  }

  async findAll(institutionId: string): Promise<Events[]> {
    return await this.prisma.events.findMany({
      where: {
        institutionId: institutionId,
      },
    });
  }

  async findOne(institutionId: string, id: string): Promise<Events> {
    return await this.prisma.events.findUniqueOrThrow({
      where: {
        id: id,
        institutionId: institutionId,
      },
    });
  }

  async update(
    institutionId: string,
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<void> {
    await this.prisma.events.update({
      where: {
        id: id,
        institutionId: institutionId,
      },
      data: {
        title: updateEventDto.title,
        date: updateEventDto.date ? new Date(updateEventDto.date) : undefined,
      },
    });
  }

  async remove(institutionId: string, id: string): Promise<void> {
    await this.prisma.events.delete({
      where: {
        id: id,
        institutionId: institutionId,
      },
    });
  }
}

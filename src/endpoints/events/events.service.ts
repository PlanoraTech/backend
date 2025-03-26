import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Events } from '@prisma/client';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

const eventsSelect = {
  title: true,
  date: true,
  institutionId: false,
};

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    institutionId: string,
    createEventDto: CreateEventDto,
  ): Promise<void> {
    await this.prisma.events.create({
      select: {
        id: true,
      },
      data: {
        ...createEventDto,
        institutionId: institutionId,
      },
    });
  }

  async findAll(institutionId: string): Promise<Events[]> {
    return await this.prisma.events.findMany({
      select: {
        id: true,
        ...eventsSelect,
      },
      where: {
        institutionId: institutionId,
      },
    });
  }

  async findOne(institutionId: string, id: string): Promise<Events> {
    return await this.prisma.events.findUniqueOrThrow({
      select: {
        id: true,
        ...eventsSelect,
      },
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
      select: {
        id: true,
      },
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
      select: {
        id: true,
      },
      where: {
        id: id,
        institutionId: institutionId,
      },
    });
  }
}

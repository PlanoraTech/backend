import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

export const eventsSelect: Prisma.EventsSelect = {
    id: true,
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
                title: createEventDto.title,
                date: new Date(createEventDto.date),
                institutionId: institutionId,
            },
        });
    }

    async findAll(institutionId: string): Promise<
        Prisma.EventsGetPayload<{
            select: typeof eventsSelect;
        }>[]
    > {
        return await this.prisma.events.findMany({
            select: {
                ...eventsSelect,
            },
            where: {
                institutionId: institutionId,
            },
        });
    }

    async findOne(
        institutionId: string,
        id: string,
    ): Promise<
        Prisma.EventsGetPayload<{
            select: typeof eventsSelect;
        }>
    > {
        return await this.prisma.events.findUniqueOrThrow({
            select: {
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
                title: updateEventDto.title
                    ? updateEventDto.title
                    : Prisma.skip,
                date: updateEventDto.date
                    ? new Date(updateEventDto.date)
                    : Prisma.skip,
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

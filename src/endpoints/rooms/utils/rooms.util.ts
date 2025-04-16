import { NotFoundException } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import {
    DefaultArgs,
    PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library';

export const roomsSelect: Prisma.RoomsSelect = {
    id: true,
    name: true,
    institutionId: false,
};

export async function getRoom(
    prisma: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
    >,
    institutionId: string,
    roomId: string,
    select: Prisma.RoomsSelect = roomsSelect,
): Promise<
    Prisma.RoomsGetPayload<{
        select: typeof select;
    }>
> {
    return await prisma.rooms
        .findUniqueOrThrow({
            select: {
                ...select,
            },
            where: {
                id: roomId,
                institutionId: institutionId,
            },
        })
        .catch((e) => {
            if (e instanceof PrismaClientKnownRequestError) {
                switch (e.code) {
                    case 'P2025':
                        throw new NotFoundException(
                            'A room with the given id does not exists',
                        );
                }
            }
            throw e;
        });
}

export async function getRooms(
    prisma: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
    >,
    institutionId: string,
    roomIds?: string[],
    select: Prisma.RoomsSelect = roomsSelect,
): Promise<
    Prisma.RoomsGetPayload<{
        select: typeof select;
    }>[]
> {
    return await prisma.rooms.findMany({
        select: {
            ...select,
        },
        where: {
            id: roomIds
                ? {
                      in: roomIds,
                  }
                : Prisma.skip,
            institutionId: institutionId,
        },
    });
}

export async function getOverlappingAppointments(
    prisma: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
    >,
    institutionId: string,
    excludedAppointmentIds: string[],
    roomsIds: string[],
    start: Date,
    end: Date,
): Promise<{ id: string }[]> {
    return await prisma.appointments.findMany({
        select: {
            id: true,
        },
        where: {
            id: {
                notIn: excludedAppointmentIds,
            },
            rooms: {
                some: {
                    id: {
                        in: roomsIds,
                    },
                    institutionId: institutionId,
                },
            },
            start: {
                gte: start,
                lte: end,
            },
            end: {
                gte: start,
                lte: end,
            },
            isCancelled: false,
        },
    });
}

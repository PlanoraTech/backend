import { NotFoundException } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import {
    DefaultArgs,
    PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library';
import { appointmentsSelect } from '@app/utils/generic.util';

export const presentatorsSelect: Prisma.PresentatorsSelect = {
    id: true,
    name: true,
};

export async function getPresentator(
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
    presentatorId: string,
    select: Prisma.PresentatorsSelect = presentatorsSelect,
): Promise<
    Prisma.PresentatorsGetPayload<{
        select: typeof select;
    }>
> {
    return await prisma.presentators
        .findUniqueOrThrow({
            select: {
                ...select,
            },
            where: {
                id: presentatorId,
                institutions: {
                    some: {
                        id: institutionId,
                    },
                },
            },
        })
        .catch((e) => {
            if (e instanceof PrismaClientKnownRequestError) {
                switch (e.code) {
                    case 'P2025':
                        throw new NotFoundException(
                            'A presentator with the given id does not exists',
                        );
                }
            }
            throw e;
        });
}

export async function getPresentators(
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
    presentatorIds?: string[],
    select: Prisma.PresentatorsSelect = presentatorsSelect,
): Promise<
    Prisma.PresentatorsGetPayload<{
        select: typeof select;
    }>[]
> {
    return await prisma.presentators.findMany({
        select: {
            ...select,
        },
        where: {
            id: presentatorIds
                ? {
                      in: presentatorIds,
                  }
                : Prisma.skip,
            institutions: {
                some: {
                    id: institutionId,
                },
            },
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
    presentatorIds: string[],
    start: Date,
    end: Date,
    isCancelled: boolean = false,
    select: Prisma.AppointmentsSelect = appointmentsSelect,
): Promise<
    Prisma.AppointmentsGetPayload<{
        select: typeof select;
    }>[]
> {
    return await prisma.appointments.findMany({
        select: {
            ...select,
        },
        where: {
            id: {
                notIn: excludedAppointmentIds,
            },
            presentators: {
                some: {
                    presentator: {
                        id: {
                            in: presentatorIds,
                        },
                        institutions: {
                            some: {
                                id: institutionId,
                            },
                        },
                    },
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
            isCancelled: isCancelled,
        },
    });
}

export function getOverlappingSubstitutions(
    substitutions: Prisma.SubstitutionsGetPayload<{
        select: {
            id: true;
            from: true;
            to: true;
        };
    }>[],
    to: Date,
    from: Date,
): Prisma.SubstitutionsGetPayload<{
    select: {
        id: true;
        from: true;
        to: true;
    };
}>[] {
    return substitutions.filter(
        (sub) => sub.from <= new Date(to) && sub.to >= new Date(from),
    );
}

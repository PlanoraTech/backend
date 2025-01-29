import { Prisma } from "@prisma/client";

export type ExtendedTimeTables = Prisma.TimeTablesGetPayload<{
    include: {
        events?: {
            select: {
                id?: boolean,
                title?: boolean,
                date?: boolean,
            }
        },
        appointments?: {
            select: {
                id?: boolean,
                subject?: {
                    select: {
                        id?: boolean,
                        name?: boolean,
                        subjectId?: boolean,
                    }
                },
                presentators?: {
                    select: {
                        id?: boolean,
                        name?: boolean,
                    }
                },
                rooms?: {
                    select: {
                        id?: boolean,
                        name?: boolean,
                        isAvailable?: boolean,
                    }
                },
                dayOfWeek?: boolean,
                start?: boolean,
                end?: boolean,
                isCancelled?: boolean,
                timetables?: boolean,
            },
        },
    }
}>;
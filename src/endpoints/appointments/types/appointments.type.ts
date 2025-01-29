import { Prisma } from "@prisma/client";

export type ExtendedAppointments = Prisma.AppointmentsGetPayload<{
    include: {
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
        timetables?: boolean,
    }
}>;
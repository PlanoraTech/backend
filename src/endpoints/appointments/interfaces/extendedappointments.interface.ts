import { Appointments } from '@prisma/client';

export interface ExtendedAppointments extends Appointments {
    subject: {
        id: string;
        name: string;
        subjectId: string;
    };
    rooms: {
        id: string;
        name: string;
    }[];
    timetables: {
        id: string;
        name: string;
    }[];
    presentators: {
        id: string;
        name: string;
        isSubstituted: boolean;
    }[];
}

export interface ExtendedAppointmentsWithPrismaPresentators
    extends Omit<ExtendedAppointments, 'presentators'> {
    presentators: {
        presentator: {
            id: string;
            name: string;
        };
        isSubstituted: boolean;
    }[];
}

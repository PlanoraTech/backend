import { Prisma } from '@prisma/client';
import { appointmentsSelect } from '../appointments.service';

export interface ExtendedAppointments
    extends Omit<
        Prisma.AppointmentsGetPayload<{
            select: typeof appointmentsSelect;
        }>,
        'presentators'
    > {
    presentators: {
        id: string;
        name: string;
        isSubstituted: boolean;
    }[];
}

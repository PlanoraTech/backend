export interface IAppointmentsService {
    findAll(institutionsId: string, select?: {
        appointments?: {
            select: {
                id?: boolean,
                subject?: boolean,
                presentators?: boolean,
                rooms?: boolean,
                dayOfWeek?: boolean,
                start?: boolean,
                end?: boolean,
                isCancelled?: boolean,
                timetables?: boolean,
            },
        },
    });
    findOne(institutionsId: string, id: string, select?: {
        appointments?: {
            select: {
                id?: boolean,
                subject?: boolean,
                presentators?: boolean,
                rooms?: boolean,
                dayOfWeek?: boolean,
                start?: boolean,
                end?: boolean,
                isCancelled?: boolean,
                timetables?: boolean,
            },
        },
    });
}
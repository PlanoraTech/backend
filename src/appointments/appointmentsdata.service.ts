import { IAppointmentsService } from "./interfaces/IAppointmentsService";

export class AppointmentsDataService implements IAppointmentsService {
    findAll(institutionsId: string, select?: { appointments?: { select: { id?: boolean; subject?: boolean; presentators?: boolean; rooms?: boolean; dayOfWeek?: boolean; start?: boolean; end?: boolean; isCancelled?: boolean; timetables?: boolean; }; }; }) {
        throw new Error("Method not implemented.");
    }
    findOne(institutionsId: string, id: string, select?: { appointments?: { select: { id?: boolean; subject?: boolean; presentators?: boolean; rooms?: boolean; dayOfWeek?: boolean; start?: boolean; end?: boolean; isCancelled?: boolean; timetables?: boolean; }; }; }) {
        throw new Error("Method not implemented.");
    }

}
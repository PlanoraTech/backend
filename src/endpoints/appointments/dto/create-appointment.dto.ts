import { DayOfWeek, Subjects } from "@prisma/client";

export class CreateAppointmentDto {
    start: Date;
    end: Date;
    dayOfWeek: DayOfWeek;
    isCancelled: boolean;
    subject: Subjects;
    presentators: {
        id: string,
        name: string,
        isSubstituted: boolean,
    }[];
}

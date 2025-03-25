export interface DataService {
  timetableId?: string;
  presentatorId?: string;
  roomId?: string;
}

export interface AppointmentsDataService extends DataService {
  appointmentId: string;
}

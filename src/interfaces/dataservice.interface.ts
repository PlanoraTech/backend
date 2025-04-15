/**
 * Base interface for data services.
 * Represents common properties shared across different services.
 */
export interface DataService {
    /**
     * ID of the timetable or schedule.
     * Optional because not all services may require it.
     */
    timetableId?: string;

    /**
     * ID of the presentator (e.g., teacher or speaker).
     * Optional because not all services may require it.
     */
    presentatorId?: string;

    /**
     * ID of the room associated with the service.
     * Optional because not all services may require it.
     */
    roomId?: string;
}

/**
 * Interface for appointment-related data services.
 * Extends the base DataService interface with appointment-specific properties.
 */
export interface AppointmentsDataService extends DataService {
    /**
     * ID of the appointment.
     * Required for appointment-related operations.
     */
    appointmentId: string;
}

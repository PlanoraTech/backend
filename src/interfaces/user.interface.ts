import { Roles } from '@prisma/client';

/**
 * Represents a user's association with an institution.
 */
interface UsersToInstitutions {
    /**
     * ID of the institution the user is associated with.
     */
    institutionId: string;

    /**
     * Role of the user within the institution.
     */
    role: Roles;

    /**
     * ID of the presentator (e.g., teacher or speaker) associated with the user.
     * Can be null if the user is not a presentator.
     */
    presentatorId: string | null;
}

/**
 * Represents a user in the system.
 */
export interface User {
    /**
     * Unique identifier for the user.
     */
    id: string;

    /**
     * List of institutions the user is associated with, along with their roles.
     */
    institutions: UsersToInstitutions[];
}

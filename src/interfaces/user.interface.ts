import { UsersToInstitutions } from '@prisma/client';

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
    institutions: Omit<UsersToInstitutions, 'userId'>[];
}

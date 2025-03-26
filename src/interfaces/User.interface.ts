import { Roles } from '@prisma/client';

export interface User {
    id: string;
    institutions: {
        institutionId: string;
        role: Roles;
        presentatorId: string | null;
    }[];
}

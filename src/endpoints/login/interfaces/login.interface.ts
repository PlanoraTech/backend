import { User } from '@app/interfaces/user';

export interface Login {
    user: Partial<User>;
    token?: string;
}

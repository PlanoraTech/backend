import { User } from '@app/interfaces/user.interface';

export interface Login {
    user: Partial<User>;
    token?: string;
}

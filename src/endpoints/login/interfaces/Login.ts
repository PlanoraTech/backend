import { User } from '@app/interfaces/User.interface';

export interface Login {
    user: Partial<User>;
    token?: string;
}

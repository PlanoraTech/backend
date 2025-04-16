import { User } from '@app/interfaces/user.interface';

export interface Login {
    user: User;
    token?: string;
}

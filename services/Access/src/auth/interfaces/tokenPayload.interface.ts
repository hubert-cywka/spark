import { User } from '@/auth/interfaces/user.interface';

export interface TokenPayload extends User {
    ver: number;
}

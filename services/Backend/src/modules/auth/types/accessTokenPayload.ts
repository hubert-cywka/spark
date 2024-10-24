import { User } from "@/modules/auth/models/User.model";

export type AccessTokenPayload = {
    ver: string;
} & User;

import { User } from "@/user/models/User.model";

export type AccessTokenPayload = {
    ver: string;
} & User;

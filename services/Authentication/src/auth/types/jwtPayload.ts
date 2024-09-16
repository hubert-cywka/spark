import { User } from "@/user/models/User.model";

export type JwtPayload = {
    ver: string;
} & User;

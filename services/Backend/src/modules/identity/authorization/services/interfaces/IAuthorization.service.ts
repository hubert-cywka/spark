import { User } from "@/types/User";

export const AuthorizationServiceToken = Symbol("AuthorizationService");

export interface IAuthorizationService {
    getSudoAuthorizationMethod(user: User): unknown;
}

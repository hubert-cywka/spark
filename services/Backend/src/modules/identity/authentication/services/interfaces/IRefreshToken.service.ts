import { type AccessTokenPayload } from "@/modules/identity/authentication/types/Authentication";

export const RefreshTokenServiceToken = Symbol("IRefreshTokenService");

export interface IRefreshTokenService {
    issue(payload: object): Promise<string>;
    redeem(token: string): Promise<AccessTokenPayload>;
    findOwner(token: string): Promise<string>;
    invalidate(token: string): Promise<void>;
    invalidateAllByOwnerId(ownerId: string): Promise<void>;
}

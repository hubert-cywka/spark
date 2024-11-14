import { type AccessTokenPayload } from "@/modules/identity/authentication/types/Authentication";

export const IRefreshTokenServiceToken = Symbol("IRefreshTokenService");

export interface IRefreshTokenService {
    issue(payload: object): Promise<string>;
    redeem(token: string): Promise<AccessTokenPayload>;
    invalidate(token: string): Promise<void>;
    invalidateAllByOwnerId(ownerId: string): Promise<void>;
}

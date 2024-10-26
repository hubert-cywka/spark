import { AccessTokenPayload } from "@/modules/identity/authentication/types/accessTokenPayload";

export const IRefreshTokenServiceToken = Symbol("IRefreshTokenService");

export interface IRefreshTokenService {
    sign(payload: object): Promise<string>;
    redeem(token: string): Promise<AccessTokenPayload>;
    invalidate(token: string): Promise<void>;
}

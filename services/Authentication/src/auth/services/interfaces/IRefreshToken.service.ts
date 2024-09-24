import { JwtPayload } from "@/auth/types/jwtPayload";

export const IRefreshTokenServiceToken = Symbol("IRefreshTokenService");

export interface IRefreshTokenService {
    sign(payload: object): Promise<string>;
    use(token: string): Promise<JwtPayload>;
    invalidate(token: string): Promise<void>;
}

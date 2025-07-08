import { CookieSerializeOptions } from "@fastify/cookie";
import { Injectable } from "@nestjs/common";

import { IRefreshTokenCookieStrategy } from "@/modules/identity/authentication/strategies/refreshToken/IRefreshTokenCookie.strategy";

@Injectable()
export class SecureRefreshTokenCookieStrategy implements IRefreshTokenCookieStrategy {
    public getCookieOptions(maxAge: number): CookieSerializeOptions {
        return {
            partitioned: true,
            httpOnly: true,
            secure: true,
            maxAge: maxAge,
            sameSite: "strict",
            path: "/api/auth",
        };
    }
}

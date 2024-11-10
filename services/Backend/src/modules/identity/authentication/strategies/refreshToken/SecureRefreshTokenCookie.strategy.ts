import { Injectable } from "@nestjs/common";
import { CookieOptions } from "express";

import { IRefreshTokenCookieStrategy } from "@/modules/identity/authentication/strategies/refreshToken/IRefreshTokenCookie.strategy";

@Injectable()
export class SecureRefreshTokenCookieStrategy implements IRefreshTokenCookieStrategy {
    public getCookieOptions(maxAge: number): CookieOptions {
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

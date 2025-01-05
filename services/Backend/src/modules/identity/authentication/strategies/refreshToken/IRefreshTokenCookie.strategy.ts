import { CookieOptions } from "express";

export const RefreshTokenCookieStrategyToken = Symbol("IRefreshTokenCookieStrategy");

export interface IRefreshTokenCookieStrategy {
    getCookieOptions: (maxAge: number) => CookieOptions;
}

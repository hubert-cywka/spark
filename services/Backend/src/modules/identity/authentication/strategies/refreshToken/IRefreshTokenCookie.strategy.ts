import { CookieOptions } from "express";

export const IRefreshTokenCookieStrategyToken = Symbol("IRefreshTokenCookieStrategy");

export interface IRefreshTokenCookieStrategy {
    getCookieOptions: (maxAge: number) => CookieOptions;
}

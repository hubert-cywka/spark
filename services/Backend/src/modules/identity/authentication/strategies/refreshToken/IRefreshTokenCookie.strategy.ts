import { CookieSerializeOptions } from "@fastify/cookie";

export const RefreshTokenCookieStrategyToken = Symbol("IRefreshTokenCookieStrategy");

export interface IRefreshTokenCookieStrategy {
    getCookieOptions: (maxAge: number) => CookieSerializeOptions;
}

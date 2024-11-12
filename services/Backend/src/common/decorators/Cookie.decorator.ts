import { type ExecutionContext, createParamDecorator } from "@nestjs/common";

type CookieDecoratorOptions =
    | {
          name: string;
          signed?: boolean;
      }
    | string;

export const Cookies = createParamDecorator((data: CookieDecoratorOptions, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const storage = typeof data !== "string" && data?.signed ? "signedCookies" : "cookies";
    const cookieName = typeof data === "string" ? data : data.name;

    return data ? request[storage]?.[cookieName] : request[storage];
});

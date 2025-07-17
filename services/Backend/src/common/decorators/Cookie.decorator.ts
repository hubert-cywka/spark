import { type ExecutionContext, createParamDecorator } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { FastifyRequest } from "fastify";

import { CookieContentInvalidError } from "@/common/errors/CookieContentInvalid.error";
import { CookieSignatureInvalidError } from "@/common/errors/CookieSignatureInvalid.error";
import { MissingCookieError } from "@/common/errors/MissingCookie.error";
import { ClassConstructor } from "@/types/Class";

type CookieDecoratorOptions =
    | {
          name: string;
          signed?: boolean;
          parseAs?: ClassConstructor;
      }
    | string;

export const Cookie = createParamDecorator(async (options: CookieDecoratorOptions, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();

    if (typeof options === "string") {
        return request.cookies[options];
    }

    let cookieValue = request.cookies[options.name] ?? null;

    if (!cookieValue) {
        throw new MissingCookieError(options.name);
    }

    if (options.signed) {
        // TODO: Fastify should unsign the cookie automatically
        const { value, valid } = request.unsignCookie(cookieValue);

        if (!valid) {
            throw new CookieSignatureInvalidError(options.name);
        }

        cookieValue = value;
    }

    if (!options.parseAs) {
        return cookieValue;
    }

    try {
        const parsedCookie = JSON.parse(cookieValue);
        const instance = plainToInstance(options.parseAs, parsedCookie);
        const errors = await validate(instance as object);

        if (errors.length) {
            throw new Error(errors.toString());
        }

        return instance;
    } catch (err) {
        throw new CookieContentInvalidError(options.name);
    }
});

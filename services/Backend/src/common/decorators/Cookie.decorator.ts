import { type ExecutionContext, BadRequestException, createParamDecorator } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { ClassConstructor } from "@/types/Class";

type CookieDecoratorOptions =
    | {
          name: string;
          signed?: boolean;
          parseAs?: ClassConstructor;
      }
    | string;

export const Cookie = createParamDecorator(async (options: CookieDecoratorOptions, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (typeof options === "string") {
        return request.cookies[options];
    }

    const storage = options.signed ? "signedCookies" : "cookies";
    const cookieData = request[storage]?.[options.name];

    if (!options.parseAs) {
        return cookieData;
    }

    try {
        const parsedCookie = JSON.parse(cookieData);
        const instance = plainToInstance(options.parseAs, parsedCookie);
        const errors = await validate(instance as object);

        if (errors.length) {
            throw new Error(errors.toString());
        }

        return instance;
    } catch (err) {
        throw new BadRequestException(`Cookie '${options.name}' is invalid.`);
    }
});

import { BadRequestException } from "@nestjs/common";

export class MissingCookieError extends BadRequestException {
    public constructor(cookieName: string) {
        super(`Cookie '${cookieName}' is missing.`);
    }
}

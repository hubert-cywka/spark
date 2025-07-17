import { BadRequestException } from "@nestjs/common";

export class CookieContentInvalidError extends BadRequestException {
    public constructor(cookieName: string) {
        super(`Cookie '${cookieName}' content is invalid.`);
    }
}

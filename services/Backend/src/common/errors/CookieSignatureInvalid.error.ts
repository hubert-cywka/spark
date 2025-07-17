import { BadRequestException } from "@nestjs/common";

export class CookieSignatureInvalidError extends BadRequestException {
    public constructor(cookieName: string) {
        super(`Cookie '${cookieName}' signature is invalid.`);
    }
}

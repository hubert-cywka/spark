import { BadRequestException } from "@nestjs/common";

export class UntrustedDomainError extends BadRequestException {
    constructor(url: string) {
        super(`Domain of URL ${url} is not registered as trusted.`);
    }
}

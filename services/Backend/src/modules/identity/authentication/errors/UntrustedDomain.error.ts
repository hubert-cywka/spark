import { BadRequestException } from "@nestjs/common";

export class UntrustedDomainError extends BadRequestException {
    constructor(url: string) {
        super(`URL ${url} can't be trusted.`);
    }
}

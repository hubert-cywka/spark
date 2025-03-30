import { BadRequestException } from "@nestjs/common";

export class UnsupportedOIDCProviderError extends BadRequestException {
    constructor(providerId: string) {
        super(`OIDC provider: '${providerId}' is not supported.`);
    }
}

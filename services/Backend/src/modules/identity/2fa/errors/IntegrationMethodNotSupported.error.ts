import { BadRequestException } from "@nestjs/common";

export class IntegrationMethodNotSupportedError extends BadRequestException {
    constructor(method: string) {
        super(`2FA method: '${method}' is not supported.`);
    }
}

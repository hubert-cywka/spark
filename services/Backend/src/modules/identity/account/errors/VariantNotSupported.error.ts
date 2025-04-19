import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class VariantNotSupportedError extends EntityNotFoundError {
    constructor(variant: string) {
        super(`Variant not supported: ${variant}.`);
    }
}

import { EntityNotFoundError } from "@/common/errors/EntityNotFound.error";

export class EntryDailyNotFoundError extends EntityNotFoundError {
    constructor(id: string) {
        super(`Daily '${id}' not found.`);
    }
}

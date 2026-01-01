import { ObjectStorageError } from "@/common/objectStorage/errors/ObjectStorage.error";

export class ObjectDeleteFailedError extends ObjectStorageError {
    public constructor(paths: string[]) {
        super(`Failed to delete files: ${paths.join(", ")}.`);
    }
}

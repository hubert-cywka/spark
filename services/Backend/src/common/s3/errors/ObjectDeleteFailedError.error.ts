import { ObjectStorageError } from "@/common/s3/errors/ObjectStorage.error";

export class ObjectDeleteFailedError extends ObjectStorageError {
    public constructor(paths: string[]) {
        super(`Failed to delete files: ${paths.join(", ")}.`);
    }
}

import { ObjectStorageError } from "@/common/objectStorage/errors/ObjectStorage.error";

export class ObjectZipFailedError extends ObjectStorageError {
    public constructor(path: string) {
        super(`Failed to zip file: ${path}.`);
    }
}

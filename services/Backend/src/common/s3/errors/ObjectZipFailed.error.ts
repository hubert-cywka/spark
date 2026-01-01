import { ObjectStorageError } from "@/common/s3/errors/ObjectStorage.error";

export class ObjectZipFailedError extends ObjectStorageError {
    public constructor(path: string) {
        super(`Failed to zip file: ${path}.`);
    }
}

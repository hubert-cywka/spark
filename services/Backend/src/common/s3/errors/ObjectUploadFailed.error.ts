import { ObjectStorageError } from "@/common/s3/errors/ObjectStorage.error";

export class ObjectUploadFailedError extends ObjectStorageError {
    public constructor(path: string) {
        super(`Failed to upload file: ${path}.`);
    }
}

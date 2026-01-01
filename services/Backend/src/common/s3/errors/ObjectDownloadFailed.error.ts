import { ObjectStorageError } from "@/common/s3/errors/ObjectStorage.error";

export class ObjectDownloadFailedError extends ObjectStorageError {
    public constructor(path: string) {
        super(`Failed to download file: ${path}.`);
    }
}

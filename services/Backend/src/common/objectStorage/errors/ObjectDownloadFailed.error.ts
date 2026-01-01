import { ObjectStorageError } from "@/common/objectStorage/errors/ObjectStorage.error";

export class ObjectDownloadFailedError extends ObjectStorageError {
    public constructor(path: string) {
        super(`Failed to download file: ${path}.`);
    }
}

import { ObjectStorageError } from "@/common/s3/errors/ObjectStorage.error";

export class ObjectETagEmptyError extends ObjectStorageError {
    public constructor() {
        super();
    }
}

import { ObjectStorageError } from "@/common/objectStorage/errors/ObjectStorage.error";

export class ObjectETagEmptyError extends ObjectStorageError {
    public constructor() {
        super();
    }
}

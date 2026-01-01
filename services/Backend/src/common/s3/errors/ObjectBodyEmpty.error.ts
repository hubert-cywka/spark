import { ObjectStorageError } from "@/common/s3/errors/ObjectStorage.error";

export class ObjectBodyEmptyError extends ObjectStorageError {
    public constructor() {
        super();
    }
}

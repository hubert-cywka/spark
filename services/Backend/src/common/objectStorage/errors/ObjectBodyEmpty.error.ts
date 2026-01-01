import { ObjectStorageError } from "@/common/objectStorage/errors/ObjectStorage.error";

export class ObjectBodyEmptyError extends ObjectStorageError {
    public constructor() {
        super();
    }
}

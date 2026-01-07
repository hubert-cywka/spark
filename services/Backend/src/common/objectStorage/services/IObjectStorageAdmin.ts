export const ObjectStorageAdminToken = Symbol("ObjectStorageAdminToken");

export interface IObjectStorageAdmin {
    setBucketTTL(days: number, bucket: string): Promise<void>;
}

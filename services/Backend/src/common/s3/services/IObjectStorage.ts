export const ObjectStorageToken = Symbol("ObjectStorageToken");

export interface IObjectStorage {
    upload(key: string, content: Buffer): Promise<void>;
    zipToStream(keyPrefix: string): Promise<NodeJS.ReadableStream>;
}

export const ObjectStorageToken = Symbol("ObjectStorageToken");

export interface IObjectStorage {
    upload(path: string, content: Buffer): Promise<void>;
    zipToStream(pathPrefix: string): Promise<NodeJS.ReadableStream>;
}

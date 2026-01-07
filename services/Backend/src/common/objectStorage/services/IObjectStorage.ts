import { ObjectManifest } from "@/common/objectStorage/types/ObjectManifest";

export const getObjectStorageToken = (key: string) => `ObjectStorage:${key}`;

export interface IObjectStorage {
    exists(path: string): Promise<boolean>;

    download(path: string): Promise<NodeJS.ReadableStream>;
    upload(path: string, content: Buffer, contentType: string): Promise<ObjectManifest>;
    delete(paths: string[]): Promise<void>;

    zipToStream(pathPrefix: string): Promise<NodeJS.ReadableStream>;
    zipToStorage(pathPrefix: string, destinationPath: string): Promise<ObjectManifest>;
}

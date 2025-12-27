import { ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";

export const FileServiceToken = Symbol("FileServiceToken");

export interface IFileService {
    ensureFileExists(manifest: ExportAttachmentManifest, fileContent: Blob): Promise<void>;
}

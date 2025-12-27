import { Inject, Injectable, Logger } from "@nestjs/common";
import { access, mkdir, writeFile } from "fs/promises";
import { readFile } from "node:fs/promises";
import { dirname } from "path";

import { ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";
import { type IChecksumCalculator, ChecksumCalculatorToken } from "@/common/services/interfaces/IChecksumCalculator";
import { type IFileService } from "@/common/services/interfaces/IFileService";

@Injectable()
export class FileService implements IFileService {
    private readonly logger = new Logger(FileService.name);

    public constructor(@Inject(ChecksumCalculatorToken) private readonly checksumCalculator: IChecksumCalculator) {}

    public async ensureFileExists(manifest: ExportAttachmentManifest, fileContent: Blob): Promise<void> {
        const fullPath = manifest.path;
        const checksum = await this.checksumCalculator.fromBlob(fileContent);

        try {
            await access(fullPath);
            const existingFileBuffer = await readFile(fullPath);
            const previousChecksum = await this.checksumCalculator.fromArrayBuffer(existingFileBuffer);

            if (previousChecksum === checksum) {
                this.logger.log({ fullPath, checksum }, "File has the same checksum. Skipping.");
                return;
            }

            this.logger.log({ fullPath, previousChecksum, newChecksum: checksum }, "Checksum mismatch. Overwriting.");
        } catch {
            this.logger.log({ fullPath }, "File does not exist. Creating.");
        }

        const directory = dirname(fullPath);
        await mkdir(directory, { recursive: true });

        const contentBuffer = Buffer.from(await fileContent.arrayBuffer());
        await writeFile(fullPath, contentBuffer);

        this.logger.log({ fullPath, checksum }, "File saved successfully.");
    }
}

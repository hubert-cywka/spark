import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";

import { type IChecksumCalculator } from "@/common/services/interfaces/IChecksumCalculator";

@Injectable()
export class ChecksumCalculator implements IChecksumCalculator {
    public async fromBlob(data: Blob): Promise<string> {
        const buffer = Buffer.from(await data.arrayBuffer());
        return this.calculate(buffer);
    }

    public async fromArrayBuffer(buffer: Buffer<ArrayBufferLike>): Promise<string> {
        return this.calculate(buffer);
    }

    private async calculate(buffer: Buffer): Promise<string> {
        return createHash("sha256").update(buffer).digest("hex");
    }
}

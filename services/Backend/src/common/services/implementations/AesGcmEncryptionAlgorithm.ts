import { Logger } from "@nestjs/common";
import * as crypto from "crypto";

import { type IEncryptionAlgorithm } from "../interfaces/IEncryptionAlgorithm";

import { InvalidArgumentError } from "@/common/errors/InvalidArgument.error";

const GCM_IV_LENGTH = 12;
const GCM_TAG_LENGTH = 16;
const ALGORITHM = "aes-256-gcm";

export class AesGcmEncryptionAlgorithm implements IEncryptionAlgorithm {
    private readonly logger = new Logger(AesGcmEncryptionAlgorithm.name);
    private readonly key: Buffer;

    constructor(secretKey: string) {
        this.key = Buffer.from(secretKey, "hex");
    }

    async encrypt(payload: unknown): Promise<string> {
        const data = JSON.stringify(payload);
        const iv = crypto.randomBytes(GCM_IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv);

        let encrypted = cipher.update(data, "utf8", "hex");
        encrypted += cipher.final("hex");

        const tag = cipher.getAuthTag();
        const ivBase64 = iv.toString("base64");
        const encryptedBase64 = Buffer.from(encrypted, "hex").toString("base64");
        const tagBase64 = tag.toString("base64");

        return `${ivBase64}.${encryptedBase64}.${tagBase64}`;
    }

    async decrypt<T = unknown>(encryptedPayload: string): Promise<T> {
        const parts = encryptedPayload.split(".");
        if (parts.length !== 3) {
            this.logger.error("Invalid payload.");
            throw new InvalidArgumentError("Invalid payload.");
        }

        const ivBase64 = parts[0];
        const encryptedBase64 = parts[1];
        const tagBase64 = parts[2];

        const iv = Buffer.from(ivBase64, "base64");
        const encrypted = Buffer.from(encryptedBase64, "base64").toString("hex");
        const tag = Buffer.from(tagBase64, "base64");

        if (iv.length !== GCM_IV_LENGTH) {
            this.logger.error("Invalid IV's length");
            throw new InvalidArgumentError("Invalid IV's length");
        }
        if (tag.length !== GCM_TAG_LENGTH) {
            this.logger.error("Invalid tag's length");
            throw new InvalidArgumentError("Invalid tag's length");
        }

        const decipher = crypto.createDecipheriv(ALGORITHM, this.key, iv);
        decipher.setAuthTag(tag);

        let decrypted = decipher.update(encrypted, "hex", "utf8");
        decrypted += decipher.final("utf8");

        return JSON.parse(decrypted) as T;
    }
}

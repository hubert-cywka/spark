import { IntegrationEventsEncryptionService } from "./IntegrationEventsEncryptionService";

import { IntegrationEvent } from "@/common/events";
import { AesGcmEncryptionAlgorithm } from "@/common/services/implementations/AesGcmEncryptionAlgorithm";
import { type IEncryptionAlgorithm } from "@/common/services/interfaces/IEncryptionAlgorithm";

describe("IntegrationEventsEncryptionService", () => {
    let service: IntegrationEventsEncryptionService;
    let encryptionAlgorithm: IEncryptionAlgorithm;

    const mockSecret = "a".repeat(64);

    const mockEvent = new IntegrationEvent({
        createdAt: new Date(),
        partitionKey: "abc",
        payload: { property: "value" },
        tenantId: "tenant-123",
        topic: "account",
        subject: "account.subject",
        id: "123",
    });

    beforeEach(() => {
        encryptionAlgorithm = new AesGcmEncryptionAlgorithm(mockSecret);
        service = new IntegrationEventsEncryptionService(encryptionAlgorithm);
    });

    describe("encrypt", () => {
        it("should encrypt event", async () => {
            const result = await service.encrypt(mockEvent);

            expect(result.isEncrypted()).toBe(true);
        });

        it("should not change encrypted event", async () => {
            const encrypted = await service.encrypt(mockEvent);

            const result = await service.encrypt(encrypted);

            expect(result.isEncrypted()).toBe(true);
            expect(result).toBe(encrypted);
        });
    });

    describe("decrypt", () => {
        it("should decrypt event", async () => {
            const encrypted = await service.encrypt(mockEvent);
            const result = await service.decrypt(encrypted);

            expect(result.isEncrypted()).toBe(false);
        });

        it("should not change decrypted event", async () => {
            const decrypted = mockEvent;
            const result = await service.decrypt(decrypted);

            expect(result.isEncrypted()).toBe(false);
            expect(result).toBe(decrypted);
        });
    });
});

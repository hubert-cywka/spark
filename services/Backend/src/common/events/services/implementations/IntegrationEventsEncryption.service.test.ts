import { ConfigService } from "@nestjs/config";

import { IntegrationEventsEncryptionService } from "./IntegrationEventsEncryption.service";

import { IntegrationEvent } from "@/common/events";

describe("IntegrationEventsEncryptionService", () => {
    let service: IntegrationEventsEncryptionService;
    let configService: ConfigService;

    const mockSecret = "a".repeat(64);

    const mockEvent = new IntegrationEvent({
        createdAt: new Date(),
        payload: { property: "value" },
        tenantId: "tenant-123",
        topic: "topic",
        id: "123",
    });

    beforeEach(() => {
        // @ts-expect-error: No need to mock every property
        configService = {
            getOrThrow: jest.fn().mockReturnValue(mockSecret),
        };

        service = new IntegrationEventsEncryptionService(configService);
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

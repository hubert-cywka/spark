import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { IntegrationEvent } from "@/common/events";
import { type IIntegrationEventsEncryptionService } from "@/common/events/services/interfaces/IIntegrationEventsEncryption.service";
import { AesGcmEncryptionAlgorithm } from "@/common/services/implementations/AesGcmEncryptionAlgorithm";
import { IEncryptionAlgorithm } from "@/common/services/interfaces/IEncryptionAlgorithm";

@Injectable()
export class IntegrationEventsEncryptionService implements IIntegrationEventsEncryptionService {
    private readonly encryptionAlgorithm: IEncryptionAlgorithm;

    public constructor(configService: ConfigService) {
        const encryptionSecret = configService.getOrThrow("events.encryption.secret");
        this.encryptionAlgorithm = new AesGcmEncryptionAlgorithm(encryptionSecret);
    }

    public async encrypt<T = unknown>(event: IntegrationEvent<T>): Promise<IntegrationEvent<T>> {
        if (event.isEncrypted()) {
            return event;
        }

        const encryptedPayload = await this.getEncryptionAlgorithm().encrypt(event.getRawPayload());
        return event.copy({ payload: encryptedPayload as T });
    }

    public async decrypt<T = unknown>(event: IntegrationEvent<T>): Promise<IntegrationEvent<T>> {
        if (!event.isEncrypted()) {
            return event;
        }

        const decryptedPayload = await this.getEncryptionAlgorithm().decrypt<T>(event.getRawPayload() as string);
        return event.copy({ payload: decryptedPayload });
    }

    private getEncryptionAlgorithm() {
        return this.encryptionAlgorithm;
    }
}

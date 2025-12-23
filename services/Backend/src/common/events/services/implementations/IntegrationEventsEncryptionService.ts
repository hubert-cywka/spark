import { Inject, Injectable } from "@nestjs/common";

import { IntegrationEvent } from "@/common/events";
import { type IIntegrationEventsEncryptionService } from "@/common/events/services/interfaces/IIntegrationEventsEncryptionService";
import { IntegrationEventsEncryptionAlgorithmToken } from "@/common/events/services/tokens/IntegrationEventsEncryptionAlgorithm.token";
import { type IEncryptionAlgorithm } from "@/common/services/interfaces/IEncryptionAlgorithm";

@Injectable()
export class IntegrationEventsEncryptionService implements IIntegrationEventsEncryptionService {
    public constructor(
        @Inject(IntegrationEventsEncryptionAlgorithmToken)
        private readonly encryptionAlgorithm: IEncryptionAlgorithm
    ) {}

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

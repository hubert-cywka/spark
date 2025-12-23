import { IntegrationEvent } from "@/common/events";

export const IntegrationEventsEncryptionServiceToken = Symbol("IntegrationEventsEncryptionService");

export interface IIntegrationEventsEncryptionService {
    encrypt<T = unknown>(event: IntegrationEvent<T>): Promise<IntegrationEvent<T>>;
    decrypt<T = unknown>(event: IntegrationEvent<T>): Promise<IntegrationEvent<T>>;
}

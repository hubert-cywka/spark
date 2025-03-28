import { AccountRegisteredEventPayload } from "@/common/events";

export const AuthPublisherServiceToken = Symbol("IAuthPublisherServiceToken");

export interface IAuthPublisherService {
    onAccountRegistered(tenantId: string, payload: AccountRegisteredEventPayload): Promise<void>;
}

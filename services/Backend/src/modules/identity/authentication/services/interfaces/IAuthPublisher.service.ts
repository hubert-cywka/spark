import { AccountRegisteredEventPayload } from "@/common/events";

export const AuthPublisherServiceToken = Symbol("IAuthPublisherServiceToken");

export interface IAuthPublisherService {
    onAccountRegistered(payload: AccountRegisteredEventPayload): Promise<void>;
}

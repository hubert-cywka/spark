import { AccountRegisteredEventPayload } from "@/common/events";

export const IAuthPublisherServiceToken = Symbol("IAuthPublisherServiceToken");

export interface IAuthPublisherService {
    onAccountRegistered(payload: AccountRegisteredEventPayload): void;
}

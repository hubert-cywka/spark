import { AccountRemovalRequestedEventPayload } from "@/common/events/types/account/AccountRemovalRequestedEvent";

export const UserEventsPublisherToken = Symbol("UserEventsPublisher");

export interface IUserEventsPublisher {
    onDataRemovalRequested(tenantId: string, payload: AccountRemovalRequestedEventPayload): Promise<void>;
}

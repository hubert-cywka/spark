import { AccountRemovalRequestedEventPayload } from "@/common/events/types/account/AccountRemovalRequestedEvent";

export const UserPublisherServiceToken = Symbol("UserPublisherService");

export interface IUserPublisherService {
    onDataRemovalRequested(tenantId: string, payload: AccountRemovalRequestedEventPayload): Promise<void>;
}

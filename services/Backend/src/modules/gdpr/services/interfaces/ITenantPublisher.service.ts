import { AccountRemovalCompletedEventPayload } from "@/common/events/types/account/AccountRemovalCompletedEvent";

export const TenantPublisherServiceToken = Symbol("TenantPublisherService");

export interface ITenantPublisherService {
    onDataPurged(tenantId: string, payload: AccountRemovalCompletedEventPayload): Promise<void>;
}

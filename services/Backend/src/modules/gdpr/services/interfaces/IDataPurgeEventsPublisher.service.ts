import { AccountRemovalCompletedEventPayload } from "@/common/events/types/account/AccountRemovalCompletedEvent";
import { AccountRemovalScheduledEventPayload } from "@/common/events/types/account/AccountRemovalScheduledEvent";

export const DataPurgeEventsPublisherToken = Symbol("DataPurgeEventsPublisher");

export interface IDataPurgeEventsPublisher {
    onPurgePlanProcessed(tenantId: string, payload: AccountRemovalCompletedEventPayload): Promise<void>;
    onPurgePlanScheduled(tenantId: string, payload: AccountRemovalScheduledEventPayload): Promise<void>;
}

import { AccountRemovalCompletedEventPayload } from "@/common/events/types/account/AccountRemovalCompletedEvent";

export const DataPurgePublisherServiceToken = Symbol("DataPurgePublisherService");

export interface IDataPurgePublisherService {
    onPurgePlanProcessed(tenantId: string, payload: AccountRemovalCompletedEventPayload): Promise<void>;
}

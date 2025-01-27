import { IntegrationEvent } from "@/common/events/types/IntegrationEvent";

export const InboxEventHandlersToken = Symbol("InboxEventHandlers");

export interface IInboxEventHandler {
    canHandle(topic: string): boolean;
    handle(event: IntegrationEvent): Promise<void>;
}

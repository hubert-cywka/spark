import { type IInboxEventHandler } from "@/common/events";

export const IntegrationEventsJobsOrchestratorToken = Symbol("IntegrationEventsJobsOrchestrator");

export interface IIntegrationEventsJobsOrchestrator {
    init(handlers: IInboxEventHandler[]): void;
}

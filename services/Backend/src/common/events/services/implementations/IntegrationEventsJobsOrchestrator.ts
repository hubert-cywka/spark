import { Inject } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import dayjs from "dayjs";

import { type IEventInbox, type IEventOutbox, type IInboxEventHandler, EventInboxToken, EventOutboxToken } from "@/common/events";
import { type IEventInboxProcessor, EventInboxProcessorToken } from "@/common/events/services/interfaces/IEventInboxProcessor";
import { type IEventOutboxProcessor, EventOutboxProcessorToken } from "@/common/events/services/interfaces/IEventOutboxProcessor";
import {
    type IEventsRemovalService,
    InboxEventsRemovalServiceToken,
    OutboxEventsRemovalServiceToken,
} from "@/common/events/services/interfaces/IEventsRemoval.service";
import { type IIntegrationEventsJobsOrchestrator } from "@/common/events/services/interfaces/IIntegrationEventsJobsOrchestrator";

const EVENTS_RETENTION_PERIOD_IN_DAYS = 7;
const OUTBOX_PROCESSING_INTERVAL_IN_MS = 1000 * 10;
const INBOX_PROCESSING_INTERVAL_IN_MS = 1000 * 10;
const CLEARING_INTERVAL_IN_MS = 1000 * 60 * 60 * 12;

export class IntegrationEventsJobsOrchestrator implements IIntegrationEventsJobsOrchestrator {
    public constructor(
        @Inject(EventInboxToken) private readonly inbox: IEventInbox,
        @Inject(EventOutboxToken) private readonly outbox: IEventOutbox,
        @Inject(InboxEventsRemovalServiceToken)
        private readonly inboxRemovalService: IEventsRemovalService,
        @Inject(OutboxEventsRemovalServiceToken)
        private readonly outboxRemovalService: IEventsRemovalService,
        @Inject(EventInboxProcessorToken)
        private readonly inboxProcessor: IEventInboxProcessor,
        @Inject(EventOutboxProcessorToken)
        private readonly outboxProcessor: IEventOutboxProcessor,
        private readonly registry: SchedulerRegistry
    ) {}

    public startProcessingInbox(handlers: IInboxEventHandler[]) {
        this.inboxProcessor.setEventHandlers(handlers);
        this.inbox.subscribe(this.inboxProcessor);

        const job = setInterval(async () => {
            await this.inboxProcessor.processPendingEvents();
        }, INBOX_PROCESSING_INTERVAL_IN_MS);

        const jobId = this.createJobId();
        this.registry.addInterval(jobId, job);
    }

    public startProcessingOutbox() {
        this.outbox.subscribe(this.outboxProcessor);

        const job = setInterval(async () => {
            await this.outboxProcessor.processPendingEvents();
        }, OUTBOX_PROCESSING_INTERVAL_IN_MS);

        const jobId = this.createJobId();
        this.registry.addInterval(jobId, job);
    }

    public startClearingInbox() {
        const job = setInterval(async () => {
            const processedBefore = dayjs().subtract(EVENTS_RETENTION_PERIOD_IN_DAYS, "days").toDate();
            await this.inboxRemovalService.removeProcessedBefore(processedBefore);
        }, CLEARING_INTERVAL_IN_MS);

        const jobId = this.createJobId();
        this.registry.addInterval(jobId, job);
    }

    public startClearingOutbox() {
        const job = setInterval(async () => {
            const processedBefore = dayjs().subtract(EVENTS_RETENTION_PERIOD_IN_DAYS, "days").toDate();
            await this.outboxRemovalService.removeProcessedBefore(processedBefore);
        }, CLEARING_INTERVAL_IN_MS);

        const jobId = this.createJobId();
        this.registry.addInterval(jobId, job);
    }

    private createJobId() {
        return crypto.randomUUID();
    }
}

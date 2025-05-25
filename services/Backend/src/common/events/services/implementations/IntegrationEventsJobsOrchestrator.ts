import { Inject, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import dayjs from "dayjs";

import { type IEventInbox, type IEventOutbox, type IInboxEventHandler, EventInboxToken, EventOutboxToken } from "@/common/events";
import { type IEventInboxProcessor, EventInboxProcessorToken } from "@/common/events/services/interfaces/IEventInboxProcessor";
import { type IEventOutboxProcessor, EventOutboxProcessorToken } from "@/common/events/services/interfaces/IEventOutboxProcessor";
import { type IIntegrationEventsJobsOrchestrator } from "@/common/events/services/interfaces/IIntegrationEventsJobsOrchestrator";

const EVENTS_RETENTION_PERIOD_IN_DAYS = 7;
const OUTBOX_PROCESSING_INTERVAL_IN_MS = 1000 * 10;
const INBOX_PROCESSING_INTERVAL_IN_MS = 1000;
const CLEARING_INTERVAL_IN_MS = 1000 * 60 * 60 * 12;

export class IntegrationEventsJobsOrchestrator implements IIntegrationEventsJobsOrchestrator {
    private readonly logger = new Logger(IntegrationEventsJobsOrchestrator.name);
    private isInitialized = false;

    public constructor(
        @Inject(EventInboxToken) private readonly inbox: IEventInbox,
        @Inject(EventOutboxToken) private readonly outbox: IEventOutbox,
        @Inject(EventInboxProcessorToken)
        private readonly inboxProcessor: IEventInboxProcessor,
        @Inject(EventOutboxProcessorToken)
        private readonly outboxProcessor: IEventOutboxProcessor,
        private readonly registry: SchedulerRegistry
    ) {}

    public start(handlers: IInboxEventHandler[]) {
        if (this.isInitialized) {
            this.logger.warn("Already initialized.");
            return;
        }

        this.startProcessingInbox(handlers);
        this.startProcessingOutbox();
        this.startClearingInbox();
        this.startClearingOutbox();

        this.logger.log("All jobs have been initialized.");
        this.isInitialized = true;
    }

    private startProcessingInbox(handlers: IInboxEventHandler[]) {
        this.inboxProcessor.setEventHandlers(handlers);
        this.inbox.subscribe(this.inboxProcessor);

        const job = setInterval(async () => {
            await this.inboxProcessor.processPendingEvents();
        }, INBOX_PROCESSING_INTERVAL_IN_MS);

        const jobId = this.createJobId();
        this.registry.addInterval(jobId, job);
    }

    private startProcessingOutbox() {
        this.outbox.subscribe(this.outboxProcessor);

        const job = setInterval(async () => {
            await this.outboxProcessor.processPendingEvents();
        }, OUTBOX_PROCESSING_INTERVAL_IN_MS);

        const jobId = this.createJobId();
        this.registry.addInterval(jobId, job);
    }

    private startClearingInbox() {
        const job = setInterval(async () => {
            const processedBefore = dayjs().subtract(EVENTS_RETENTION_PERIOD_IN_DAYS, "days").toDate();
            await this.inbox.clearProcessedEvents(processedBefore);
        }, CLEARING_INTERVAL_IN_MS);

        const jobId = this.createJobId();
        this.registry.addInterval(jobId, job);
    }

    private startClearingOutbox() {
        const job = setInterval(async () => {
            const processedBefore = dayjs().subtract(EVENTS_RETENTION_PERIOD_IN_DAYS, "days").toDate();
            await this.outbox.clearProcessedEvents(processedBefore);
        }, CLEARING_INTERVAL_IN_MS);

        const jobId = this.createJobId();
        this.registry.addInterval(jobId, job);
    }

    private createJobId() {
        return crypto.randomUUID();
    }
}

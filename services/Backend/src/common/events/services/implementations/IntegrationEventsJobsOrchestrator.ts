import { Inject, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import dayjs from "dayjs";

import { type IEventInbox, type IEventOutbox, type IInboxEventHandler, EventInboxToken, EventOutboxToken } from "@/common/events";
import { type IIntegrationEventsJobsOrchestrator } from "@/common/events/services/interfaces/IIntegrationEventsJobsOrchestrator";

const EVENTS_RETENTION_PERIOD_IN_DAYS = 7;
const PROCESSING_INTERVAL_IN_MS = 1000;
const CLEARING_INTERVAL_IN_MS = 1000 * 60 * 60 * 3;

export class IntegrationEventsJobsOrchestrator implements IIntegrationEventsJobsOrchestrator {
    private readonly logger = new Logger(IntegrationEventsJobsOrchestrator.name);
    private isInitialized = false;

    public constructor(
        @Inject(EventInboxToken) private readonly inbox: IEventInbox,
        @Inject(EventOutboxToken) private readonly outbox: IEventOutbox,
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
        const job = setInterval(async () => {
            await this.inbox.processPendingEvents(handlers);
        }, PROCESSING_INTERVAL_IN_MS);

        const jobId = this.createJobId();
        this.registry.addInterval(jobId, job);
    }

    private startProcessingOutbox() {
        const job = setInterval(async () => {
            await this.outbox.processPendingEvents();
        }, PROCESSING_INTERVAL_IN_MS);

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

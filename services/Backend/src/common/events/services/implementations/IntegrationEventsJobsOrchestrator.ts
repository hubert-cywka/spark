import { Inject, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
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

export class IntegrationEventsJobsOrchestrator implements IIntegrationEventsJobsOrchestrator {
    private readonly logger: Logger;

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
        private readonly registry: SchedulerRegistry,
        private readonly configService: ConfigService
    ) {
        this.logger = new Logger(IntegrationEventsJobsOrchestrator.name);
    }

    public startProcessingInbox(handlers: IInboxEventHandler[]) {
        this.inboxProcessor.setEventHandlers(handlers);
        this.inbox.subscribe(this.inboxProcessor);
        this.scheduleRecursiveInboxProcessing();
    }

    private scheduleRecursiveInboxProcessing() {
        const job = setTimeout(async () => {
            try {
                await this.inboxProcessor.processPendingEvents();
            } catch (error) {
                this.logger.error(error, "Inbox processing failed.");
            }

            this.scheduleRecursiveInboxProcessing();
        }, this.configService.getOrThrow<number>("events.inbox.processing.pollingInterval"));

        const jobId = this.createJobId();
        this.registry.addTimeout(jobId, job);
    }

    public startProcessingOutbox() {
        this.outbox.subscribe(this.outboxProcessor);
        this.scheduleRecursiveOutboxProcessing();
    }

    private scheduleRecursiveOutboxProcessing() {
        const job = setTimeout(async () => {
            try {
                await this.outboxProcessor.processPendingEvents();
            } catch (error) {
                this.logger.error(error, "Outbox processing failed.");
            }

            this.scheduleRecursiveOutboxProcessing();
        }, this.configService.getOrThrow<number>("events.outbox.processing.pollingInterval"));

        const jobId = this.createJobId();
        this.registry.addTimeout(jobId, job);
    }

    public startClearingInbox() {
        const job = setInterval(async () => {
            const processedBefore = dayjs().subtract(EVENTS_RETENTION_PERIOD_IN_DAYS, "days").toDate();
            await this.inboxRemovalService.removeProcessedBefore(processedBefore);
        }, this.configService.getOrThrow<number>("events.inbox.processing.clearingInterval"));

        const jobId = this.createJobId();
        this.registry.addInterval(jobId, job);
    }

    public startClearingOutbox() {
        const job = setInterval(async () => {
            const processedBefore = dayjs().subtract(EVENTS_RETENTION_PERIOD_IN_DAYS, "days").toDate();
            await this.outboxRemovalService.removeProcessedBefore(processedBefore);
        }, this.configService.getOrThrow<number>("events.outbox.processing.clearingInterval"));

        const jobId = this.createJobId();
        this.registry.addInterval(jobId, job);
    }

    private createJobId() {
        return crypto.randomUUID();
    }
}

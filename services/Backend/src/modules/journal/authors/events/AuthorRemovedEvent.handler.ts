import { Inject, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

import { type IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import {
    type IEventsRemovalService,
    InboxEventsRemovalServiceToken,
    OutboxEventsRemovalServiceToken,
} from "@/common/events/services/interfaces/IEventsRemoval.service";
import { type AccountRemovalCompletedEventPayload } from "@/common/events/types/account/AccountRemovalCompletedEvent";
import { type IAuthorService, AuthorServiceToken } from "@/modules/journal/authors/services/interfaces/IAuthor.service";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";

@Injectable()
export class AuthorRemovedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(AuthorServiceToken)
        private readonly authorService: IAuthorService,
        @Inject(InboxEventsRemovalServiceToken)
        private readonly inboxRemovalService: IEventsRemovalService,
        @Inject(OutboxEventsRemovalServiceToken)
        private readonly outboxRemovalService: IEventsRemovalService
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.removal.completed;
    }

    @Transactional({ connectionName: JOURNAL_MODULE_DATA_SOURCE })
    async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountRemovalCompletedEventPayload;
        await this.inboxRemovalService.removeByTenant(payload.account.id);
        await this.outboxRemovalService.removeByTenant(payload.account.id);
        await this.authorService.remove(payload.account.id);
    }
}

import { Inject, Injectable } from "@nestjs/common";

import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { whenError } from "@/common/errors/whenError";
import { type AccountCreatedEventPayload, type IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { type IAuthorService, AuthorServiceToken } from "@/modules/journal/authors/services/interfaces/IAuthor.service";

@Injectable()
export class AccountCreatedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(AuthorServiceToken)
        private readonly authorsService: IAuthorService
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.created;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        const payload = (await event.getPayload()) as AccountCreatedEventPayload;
        try {
            await this.authorsService.create(payload.id);
        } catch (e) {
            whenError(e).is(EntityConflictError).throwRpcException("Author already exists.").elseRethrow();
        }
    }
}

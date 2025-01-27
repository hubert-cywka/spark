import { Inject, Injectable } from "@nestjs/common";

import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { whenError } from "@/common/errors/whenError";
import { type AccountRegisteredEventPayload, type IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { type IAuthorService, AuthorServiceToken } from "@/modules/journal/authors/services/interfaces/IAuthor.service";

@Injectable()
export class AccountRegisteredEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(AuthorServiceToken)
        private readonly authorsService: IAuthorService
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.registration.completed;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountRegisteredEventPayload;
        try {
            await this.authorsService.create(payload.account.id);
        } catch (e) {
            whenError(e).is(EntityConflictError).throwRpcException("Author already exists.").elseRethrow();
        }
    }
}

import { Inject, Injectable } from "@nestjs/common";

import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { whenError } from "@/common/errors/whenError";
import { AccountRegisteredEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { type IRecipientService, RecipientServiceToken } from "@/modules/alerts/services/interfaces/IRecipient.service";

@Injectable()
export class RecipientRegisteredEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(RecipientServiceToken)
        private readonly recipientService: IRecipientService
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.registration.completed;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountRegisteredEventPayload;
        try {
            await this.recipientService.create(payload.account.id, payload.account.email);
        } catch (e) {
            whenError(e).is(EntityConflictError).throwRpcException("Recipient already exists.").elseRethrow();
        }
    }
}

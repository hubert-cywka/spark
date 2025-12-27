import { Inject, Injectable } from "@nestjs/common";

import { AccountCreatedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import { type IRecipientService, RecipientServiceToken } from "@/modules/alerts/services/interfaces/IRecipientService";

@Injectable()
export class RecipientCreatedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(RecipientServiceToken)
        private readonly recipientService: IRecipientService
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.account.created.subject;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountCreatedEventPayload;
        await this.recipientService.create(payload.account.id);
    }
}

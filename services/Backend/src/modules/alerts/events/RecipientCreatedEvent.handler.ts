import { Inject, Injectable } from "@nestjs/common";

import { AccountCreatedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { type IRecipientService, RecipientServiceToken } from "@/modules/alerts/services/interfaces/IRecipient.service";

@Injectable()
export class RecipientCreatedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(RecipientServiceToken)
        private readonly recipientService: IRecipientService
    ) {}

    public canHandle(subject: string): boolean {
        return subject === IntegrationEvents.account.created.subject;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountCreatedEventPayload;
        await this.recipientService.create(payload.account.id);
    }
}

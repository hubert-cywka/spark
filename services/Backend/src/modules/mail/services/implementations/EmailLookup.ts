import { Inject, Injectable } from "@nestjs/common";

import { type IEmailLookup } from "@/modules/mail/services/interfaces/IEmailLookup";
import { type IRecipientService, RecipientServiceToken } from "@/modules/mail/services/interfaces/IRecipientService";

@Injectable()
export class EmailLookup implements IEmailLookup {
    public constructor(
        @Inject(RecipientServiceToken)
        private recipientService: IRecipientService
    ) {}

    public async findByRecipientId(id: string): Promise<string> {
        const recipient = await this.recipientService.find(id);
        return recipient.email;
    }
}

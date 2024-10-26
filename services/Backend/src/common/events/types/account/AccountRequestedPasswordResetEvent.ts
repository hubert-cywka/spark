import { DomainEvent } from "../DomainEvent";

import { EventTopics } from "@/common/events";

export type AccountRequestedPasswordResetEventPayload = {
    email: string;
    passwordResetToken: string;
};

export class AccountRequestedPasswordResetEvent extends DomainEvent {
    public constructor(payload: AccountRequestedPasswordResetEventPayload) {
        super(EventTopics.account.passwordResetRequested, payload);
    }
}

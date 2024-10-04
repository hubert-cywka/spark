import { PUBSUB_TOPICS } from "../PUBSUB_TOPICS";
import { PubSubEvent } from "../PubSubEvent";

export type UserRequestedPasswordResetEventPayload = {
    email: string;
    passwordResetToken: string;
};

export class UserRequestedPasswordResetEvent extends PubSubEvent {
    public constructor(payload: UserRequestedPasswordResetEventPayload) {
        super(PUBSUB_TOPICS.user.passwordResetRequested, payload);
    }
}

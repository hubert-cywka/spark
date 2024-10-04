import { PUBSUB_TOPICS } from "../PUBSUB_TOPICS";
import { PubSubEvent } from "../PubSubEvent";

export type UserRequestedPasswordChangeEventPayload = {
    user: {
        id: string;
    };
};

export class UserRequestedPasswordChangeEvent extends PubSubEvent {
    public constructor(payload: UserRequestedPasswordChangeEventPayload) {
        super(PUBSUB_TOPICS.user.passwordChangeRequested, payload);
    }
}

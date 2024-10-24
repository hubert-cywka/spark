import { PUBSUB_TOPICS } from "../PUBSUB_TOPICS";
import { PubSubEvent } from "../PubSubEvent";

export type UserRegisteredEventPayload = {
    user: {
        id: string;
        email: string;
        lastName: string;
        firstName: string;
    };
};

export class UserRegisteredEvent extends PubSubEvent {
    public constructor(payload: UserRegisteredEventPayload) {
        super(PUBSUB_TOPICS.user.registered, payload);
    }
}

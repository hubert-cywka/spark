import { PUBSUB_TOPICS } from "../PUBSUB_TOPICS";
import { PubSubEvent } from "../PubSubEvent";

export class UserRegisteredEvent extends PubSubEvent {
    public constructor(user: { id: string; email: string }, activationToken: string) {
        const payload = { user, activationToken };
        super(PUBSUB_TOPICS.user.registered, payload);
    }
}

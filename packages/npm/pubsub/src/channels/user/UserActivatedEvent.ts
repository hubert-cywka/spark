import { PUBSUB_TOPICS } from "../PUBSUB_TOPICS";
import { PubSubEvent } from "../PubSubEvent";

export class UserActivatedEvent extends PubSubEvent {
    public constructor(user: { id: string; email: string }) {
        const payload = { user };
        super(PUBSUB_TOPICS.user.activated, payload);
    }
}

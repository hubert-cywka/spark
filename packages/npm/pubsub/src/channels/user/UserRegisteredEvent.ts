import { PUBSUB_EVENTS } from "@/common/pubsub/channels/PUBSUB_EVENTS";
import { PubSubEvent } from "@/common/pubsub/channels/PubSubEvent";

export class UserRegisteredEvent extends PubSubEvent {
    public constructor(user: { id: string; email: string }, activationToken: string) {
        const payload = { user, activationToken };
        super(PUBSUB_EVENTS.user.registered, payload);
    }
}

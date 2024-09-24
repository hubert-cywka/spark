import { PUBSUB_EVENTS } from "@/common/pubsub/channels/PUBSUB_EVENTS";
import { PubSubEvent } from "@/common/pubsub/channels/PubSubEvent";

export class UserActivatedEvent extends PubSubEvent {
    public constructor(user: { id: string; email: string }) {
        const payload = { user };
        super(PUBSUB_EVENTS.user.activated, payload);
    }
}

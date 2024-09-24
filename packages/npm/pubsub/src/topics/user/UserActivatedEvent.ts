import { PUBSUB_TOPICS } from "../PUBSUB_TOPICS";
import { PubSubEvent } from "../PubSubEvent";

export type UserActivatedEventPayload = {
    user: {
        id: string;
        email: string;
    };
};

export class UserActivatedEvent extends PubSubEvent {
    public constructor(payload: UserActivatedEventPayload) {
        super(PUBSUB_TOPICS.user.activated, payload);
    }
}

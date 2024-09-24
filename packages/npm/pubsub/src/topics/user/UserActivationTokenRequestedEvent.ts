import { PUBSUB_TOPICS } from "../PUBSUB_TOPICS";
import { PubSubEvent } from "../PubSubEvent";

export type UserActivationTokenRequestedEventPayload = {
    activationToken: string;
    email: string;
};

export class UserActivationTokenRequestedEvent extends PubSubEvent {
    public constructor(payload: UserActivationTokenRequestedEventPayload) {
        super(PUBSUB_TOPICS.user.activated, payload);
    }
}

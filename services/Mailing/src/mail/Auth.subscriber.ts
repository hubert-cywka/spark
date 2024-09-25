import { PUBSUB_TOPICS } from "@hcywka/pubsub";
import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

@Controller()
export class AuthSubscriber {
    private readonly logger = new Logger();

    @EventPattern(PUBSUB_TOPICS.user.registered)
    public onUserRegistered(@Payload() payload: unknown) {
        this.logger.log({ topic: PUBSUB_TOPICS.user.registered, payload }, "Received an event.");
    }

    @EventPattern(PUBSUB_TOPICS.user.activated)
    public onUserActivated(@Payload() payload: unknown) {
        this.logger.log({ topic: PUBSUB_TOPICS.user.activated, payload }, "Received an event.");
    }
}

import { IInboxEventHandler, IntegrationEvent } from "@/common/events";
import { wait } from "@/common/utils/timeUtils";

export class TestEventHandler implements IInboxEventHandler {
    public constructor(
        private readonly topic: string,
        private readonly waitTime: number = 0
    ) {}

    public canHandle(topic: string): boolean {
        return topic === this.topic;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        await wait(this.waitTime);
    }
}

import { IInboxEventHandler, IntegrationEvent } from "@/common/events";
import { wait } from "@/common/utils/timeUtils";

export class TestEventHandler implements IInboxEventHandler {
    public constructor(
        private readonly subject: string,
        private readonly waitTime: number = 0
    ) {}

    public canHandle(subject: string): boolean {
        return subject === this.subject;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        await wait(this.waitTime);
    }
}

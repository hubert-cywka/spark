import { IInboxEventHandler, IntegrationEvent } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import { wait } from "@/common/utils/timeUtils";

export class TestEventHandler implements IInboxEventHandler {
    public constructor(private readonly waitTime: number = 0) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return true;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        await wait(this.waitTime);
    }
}

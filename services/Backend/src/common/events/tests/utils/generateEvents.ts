import { IntegrationEvent } from "@/common/events";
import { TestEvent } from "@/common/events/tests/utils/TestEvent";
import { shuffleArray } from "@/common/utils/arrayUtils";

export function generateEvents(numOfTenants: number, eventsPerTenant: number, topic: string) {
    const events: IntegrationEvent[] = [];

    for (let tenant = 0; tenant < numOfTenants; tenant++) {
        const tenantId = crypto.randomUUID();

        for (let event = 0; event < eventsPerTenant; event++) {
            events.push(new TestEvent(topic, tenantId));
        }
    }

    return shuffleArray(events);
}

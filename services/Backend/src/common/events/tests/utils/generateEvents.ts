import dayjs from "dayjs";

import { IntegrationEvent } from "@/common/events";
import { TestEvent } from "@/common/events/tests/utils/TestEvent";

export function generateEvents(numOfTenants: number, eventsPerTenant: number, topic: string) {
    const events: IntegrationEvent[] = [];

    for (let tenant = 0; tenant < numOfTenants; tenant++) {
        const tenantId = crypto.randomUUID();

        for (let event = 0; event < eventsPerTenant; event++) {
            const createdAt = dayjs()
                .add(event * 100, "ms")
                .toDate();

            events.push(new TestEvent(topic, tenantId, createdAt));
        }
    }

    return events;
}

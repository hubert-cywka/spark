import dayjs from "dayjs";

import { IntegrationEvent } from "@/common/events";
import { TestEvent } from "@/common/events/tests/utils/TestEvent";
import { IntegrationEventSubject, IntegrationEventTopic } from "@/common/events/types";

export function generateEvents(numOfTenants: number, eventsPerTenant: number, topic: IntegrationEventTopic) {
    const events: IntegrationEvent[] = [];

    for (let tenant = 0; tenant < numOfTenants; tenant++) {
        const tenantId = crypto.randomUUID();

        for (let event = 0; event < eventsPerTenant; event++) {
            const createdAt = dayjs()
                .add(event * 100, "ms")
                .toDate();

            const subject: IntegrationEventSubject = `${topic}.${Math.floor(Math.random() * 3)}`;
            events.push(new TestEvent(topic, subject, tenantId, createdAt));
        }
    }

    return events;
}

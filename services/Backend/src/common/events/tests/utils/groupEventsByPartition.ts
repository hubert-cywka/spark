import { IntegrationEvent } from "@/common/events";

export function groupEventsByPartition(events: IntegrationEvent[]) {
    return events.reduce(
        (acc, event) => {
            const key = event.getPartitionKey();
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(event);
            return acc;
        },
        {} as Record<string, IntegrationEvent[]>
    );
}

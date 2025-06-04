import { IntegrationEvent } from "@/common/events";

export function sortCreatedAtTimestamps(events: IntegrationEvent[]) {
    const original = events.map((event) => event.getCreatedAt());
    const sorted = [...original].sort((a, b) => a.getTime() - b.getTime());
    return { sorted, original };
}

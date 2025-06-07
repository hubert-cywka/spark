import { IntegrationEvent } from "@/common/events";

export function sortByCreatedAtTimestamps(events: IntegrationEvent[]) {
    return [...events].sort((a, b) => a.getCreatedAt().getTime() - b.getCreatedAt().getTime());
}

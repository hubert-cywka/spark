import { GoalsQueryFilters } from "@/features/goals/api/types/GoalsQueryFilters";

const BASE_QUERY_KEY = "goals";

export class GoalQueryKeyFactory {
    public static createForAll() {
        return [BASE_QUERY_KEY];
    }

    public static createForFiltered({ entries = [], excludeEntries = [], name = "", pageSize }: GoalsQueryFilters = {}) {
        return [
            BASE_QUERY_KEY,
            `name:${name}`,
            `pageSize:${pageSize}`,
            ...entries.map((id) => `entryId:${id}`),
            ...excludeEntries.map((id) => `excludedEntryId:${id}`),
        ];
    }

    public static createForOne(id: string) {
        return [BASE_QUERY_KEY, { id }];
    }
}

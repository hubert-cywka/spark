import { GoalsQueryFilters } from "@/features/goals/api/types/GoalsQueryFilters";

const BASE_QUERY_KEY = "goals";

export class GoalQueryKeyFactory {
    public static createForAll() {
        return [BASE_QUERY_KEY];
    }

    public static createForFiltered({
        entries = [],
        excludeEntries = [],
        name = "",
        pageSize,
        withProgress = false,
    }: GoalsQueryFilters = {}) {
        const queryKey = [BASE_QUERY_KEY];

        if (withProgress) {
            queryKey.push("withProgress");
        }

        if (entries) {
            queryKey.push(...entries.map((id) => `entryId:${id}`));
        }

        if (excludeEntries) {
            queryKey.push(...excludeEntries.map((id) => `excludedEntryId:${id}`));
        }

        if (name) {
            queryKey.push(`name:${name}`);
        }

        if (pageSize) {
            queryKey.push(`pageSize:${pageSize}`);
        }

        return queryKey;
    }

    public static createForOne(id: string) {
        return [BASE_QUERY_KEY, { id }];
    }
}

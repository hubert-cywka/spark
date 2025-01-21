import { GoalsQueryFilters } from "@/features/goals/api/types/GoalsQueryFilters";

const BASE_QUERY_KEY = "goals";

export class GoalQueryKeyFactory {
    public static createForAll() {
        return [BASE_QUERY_KEY];
    }

    public static createForFiltered(filters: GoalsQueryFilters = {}) {
        return [BASE_QUERY_KEY, filters];
    }

    public static createForOne(id: string) {
        return [BASE_QUERY_KEY, { id }];
    }
}

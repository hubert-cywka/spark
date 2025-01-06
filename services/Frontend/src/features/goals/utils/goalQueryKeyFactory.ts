const BASE_QUERY_KEY = "goals";

export class GoalQueryKeyFactory {
    public static createForAll() {
        return [BASE_QUERY_KEY];
    }

    public static createForOne(id: string) {
        return [BASE_QUERY_KEY, { id }];
    }
}

const BASE_QUERY_KEY = "entry";

export class EntriesQueryKeyFactory {
    public static createForAll() {
        return [BASE_QUERY_KEY];
    }

    public static createForFiltered(filters: unknown) {
        return [BASE_QUERY_KEY, filters];
    }

    public static createForDetailed(filters?: unknown) {
        const key = [BASE_QUERY_KEY, "detailed"];

        if (filters) {
            key.push(JSON.stringify(filters));
        }

        return key;
    }
}

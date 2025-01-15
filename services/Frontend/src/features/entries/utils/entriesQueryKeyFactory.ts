const BASE_QUERY_KEY = "entry";

export class EntriesQueryKeyFactory {
    public static createForAll() {
        return [BASE_QUERY_KEY];
    }

    public static createForDateRange(from: string, to: string) {
        return [BASE_QUERY_KEY, { from, to }];
    }
}

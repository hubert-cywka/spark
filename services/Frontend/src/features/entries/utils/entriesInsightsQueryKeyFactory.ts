const BASE_QUERY_KEY = "entries_insights";

export class EntriesInsightsQueryKeyFactory {
    public static createForAll() {
        return [BASE_QUERY_KEY];
    }

    public static createForDateRange(from: string, to: string) {
        return [BASE_QUERY_KEY, { from, to }];
    }
}

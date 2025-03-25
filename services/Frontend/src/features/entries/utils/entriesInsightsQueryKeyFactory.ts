const BASE_QUERY_KEY = "entries_insights";

export class EntriesInsightsQueryKeyFactory {
    public static createForAll() {
        return [BASE_QUERY_KEY];
    }

    public static createForMetrics(from: string, to: string) {
        return [BASE_QUERY_KEY, "metrics", { from, to }];
    }

    public static createForLoggingHistogram(from: string, to: string) {
        return [BASE_QUERY_KEY, "histogram", { from, to }];
    }
}

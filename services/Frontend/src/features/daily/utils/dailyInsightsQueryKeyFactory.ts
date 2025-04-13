const BASE_QUERY_KEY = "daily_insights";

export class DailyInsightsQueryKeyFactory {
    public static createForAll() {
        return [BASE_QUERY_KEY];
    }

    public static createForMetrics(from: string, to: string) {
        return [BASE_QUERY_KEY, "metrics", { from, to }];
    }
}

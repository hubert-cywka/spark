const BASE_QUERY_KEY = "daily_activity";

export class DailyActivityQueryKeyFactory {
    public static createForAll() {
        return [BASE_QUERY_KEY];
    }

    public static createForDateRange(from: string, to: string) {
        return [BASE_QUERY_KEY, { from, to }];
    }
}

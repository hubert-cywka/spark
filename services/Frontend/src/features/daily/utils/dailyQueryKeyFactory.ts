const BASE_QUERY_KEY = "daily";

export class DailyQueryKeyFactory {
    public static createForAll() {
        return [BASE_QUERY_KEY];
    }

    public static createForOne(id: string) {
        return [BASE_QUERY_KEY, { id }];
    }
}

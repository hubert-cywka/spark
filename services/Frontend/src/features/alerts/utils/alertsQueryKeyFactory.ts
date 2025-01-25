const BASE_QUERY_KEY = "alert";

export class AlertsQueryKeyFactory {
    public static createForAll() {
        return [BASE_QUERY_KEY];
    }
}

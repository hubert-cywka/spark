const BASE_QUERY_KEY = "export";

export class ExportsQueryKeyFactory {
    public static createForAll() {
        return [BASE_QUERY_KEY];
    }

    public static createForRecentOnes() {
        return [BASE_QUERY_KEY, "recent"];
    }
}

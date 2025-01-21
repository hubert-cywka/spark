import { EntriesQueryFilters } from "@/features/entries/api/types/EntriesQueryFilters";

const BASE_QUERY_KEY = "entry";

export class EntriesQueryKeyFactory {
    public static createForAll() {
        return [BASE_QUERY_KEY];
    }

    public static createForFiltered(filters: EntriesQueryFilters) {
        return [BASE_QUERY_KEY, filters];
    }
}

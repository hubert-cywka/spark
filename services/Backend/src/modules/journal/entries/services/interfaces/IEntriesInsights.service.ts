import { EntriesInsights } from "@/modules/journal/entries/models/EntriesInsights.model";

export const EntriesInsightsServiceToken = Symbol("EntriesInsightsService");

export interface IEntriesInsightsService {
    findByDateRange(authorId: string, from: string, to: string): Promise<EntriesInsights>;
}

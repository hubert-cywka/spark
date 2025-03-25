import { EntriesInsights } from "@/modules/journal/entries/models/EntriesInsights.model";

export const EntriesInsightsServiceToken = Symbol("EntriesInsightsService");

export interface IEntriesInsightsService {
    findMetricsByDateRange(authorId: string, from: string, to: string): Promise<EntriesInsights>;
    findLoggingHistogram(authorId: string, from: string, to: string, timezone: string): Promise<EntryLoggingHistogram>;
}

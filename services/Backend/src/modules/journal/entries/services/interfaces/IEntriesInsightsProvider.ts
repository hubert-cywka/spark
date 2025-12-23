import { EntriesInsights } from "@/modules/journal/entries/models/EntriesInsights.model";

export const EntriesInsightsProviderToken = Symbol("EntriesInsightsProvider");

export interface IEntriesInsightsProvider {
    findMetricsByDateRange(authorId: string, from: string, to: string): Promise<EntriesInsights>;
    findLoggingHistogram(authorId: string, from: string, to: string, timezone: string): Promise<EntryLoggingHistogram>;
}

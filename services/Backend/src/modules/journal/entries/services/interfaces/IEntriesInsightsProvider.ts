import { EntriesInsights } from "@/modules/journal/entries/models/EntriesInsights.model";

export const EntriesInsightsProviderToken = Symbol("EntriesInsightsProvider");

export interface IEntriesInsightsProvider {
    getMetricsByDateRange(authorId: string, from: string, to: string): Promise<EntriesInsights>;
    getLoggingHistogram(authorId: string, from: string, to: string, timezone: string): Promise<EntryLoggingHistogram>;
}

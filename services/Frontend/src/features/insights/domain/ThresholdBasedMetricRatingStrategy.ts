import { Insight } from "@/features/insights/types/Insights";

export type Threshold<T = string> = {
    limit: number;
    score: number;
    description: T;
};

export interface ThresholdBasedRatingStrategy {
    rate(): Insight | null;
    getLowestPossibleScore(): number;
    getHighestPossibleScore(): number;
}

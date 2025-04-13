import { RawInsight } from "@/features/insights/types/Insights";

export type Threshold = {
    limit: number;
    score: {
        value: number;
        key: ThresholdBasedScoreKey;
    };
};

export interface ThresholdBasedRatingStrategy {
    rate(): RawInsight<ThresholdBasedScoreKey> | null;
    getLowestPossibleScore(): number;
    getHighestPossibleScore(): number;
}

export type ThresholdBasedScoreKey =
    | "too_low"
    | "slightly_too_low"
    | "slightly_below_optimal"
    | "optimal"
    | "slightly_above_optimal"
    | "slightly_too_high"
    | "too_high";

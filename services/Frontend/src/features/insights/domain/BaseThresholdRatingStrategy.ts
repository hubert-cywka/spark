import { Threshold, ThresholdBasedRatingStrategy } from "@/features/insights/domain/ThresholdBasedMetricRatingStrategy.ts";
import { Insight } from "@/features/insights/types/Insights";

export abstract class BaseThresholdRatingStrategy implements ThresholdBasedRatingStrategy {
    protected abstract key: string;
    protected abstract minSignificantEntries: number;
    protected abstract thresholds: Threshold[];

    public abstract getLowestPossibleScore(): number;
    public abstract getHighestPossibleScore(): number;
    public abstract rate(): Insight | null;

    protected rateSingleMetric(value: number, totalEntries: number): Insight | null {
        if (totalEntries < this.minSignificantEntries) {
            return null;
        }

        let calculatedScore = 0;
        let description = "";

        for (const threshold of this.thresholds) {
            if (value <= threshold.limit) {
                calculatedScore = threshold.score;
                description = threshold.description;
                break;
            }
        }

        return {
            score: calculatedScore,
            description,
            key: this.key,
        };
    }
}

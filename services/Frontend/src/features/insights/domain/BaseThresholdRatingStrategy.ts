import {
    Threshold,
    ThresholdBasedRatingStrategy,
    ThresholdBasedScoreKey,
} from "@/features/insights/domain/ThresholdBasedMetricRatingStrategy.ts";
import { RawInsight } from "@/features/insights/types/Insights";

export abstract class BaseThresholdRatingStrategy implements ThresholdBasedRatingStrategy {
    protected abstract key: string;
    protected abstract thresholds: Threshold[];

    public abstract getLowestPossibleScore(): number;
    public abstract getHighestPossibleScore(): number;
    public abstract rate(): RawInsight<ThresholdBasedScoreKey> | null;

    protected calculateScore(percentage: number): number {
        const min = this.getLowestPossibleScore();
        const max = this.getHighestPossibleScore();
        return min + (max - min) * (percentage / 100);
    }

    protected rateSingleMetric(value: number): RawInsight<ThresholdBasedScoreKey> | null {
        let calculatedScore = null;

        for (const threshold of this.thresholds) {
            if (value <= threshold.limit) {
                calculatedScore = threshold.score;
                break;
            }
        }

        if (!calculatedScore) {
            return null;
        }

        return {
            score: calculatedScore,
            key: this.key,
        };
    }
}

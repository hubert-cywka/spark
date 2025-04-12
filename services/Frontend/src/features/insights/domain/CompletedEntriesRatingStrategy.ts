import { BaseThresholdRatingStrategy } from "@/features/insights/domain/BaseThresholdRatingStrategy.ts";
import { Threshold } from "@/features/insights/domain/ThresholdBasedMetricRatingStrategy.ts";
import { Insight } from "@/features/insights/types/Insights";

type BaseTranslationKey = "insights.summary.insights.completedEntriesRatio";
type ScoreKey = "veryLow" | "low" | "ok" | "optimal";
type DescriptionTranslationKey = `${BaseTranslationKey}.${ScoreKey}`;

export class CompletedEntriesRatingStrategy extends BaseThresholdRatingStrategy {
    protected readonly key = "completed_entries_ratio";
    protected readonly minSignificantEntries = 10;

    public constructor(
        private readonly completedEntriesRatio: number,
        private readonly totalEntriesAmount: number
    ) {
        super();
    }

    public rate(): Insight | null {
        return this.rateSingleMetric(this.completedEntriesRatio, this.totalEntriesAmount);
    }

    public getHighestPossibleScore(): number {
        return 10;
    }

    public getLowestPossibleScore(): number {
        return -10;
    }

    protected thresholds: Threshold<DescriptionTranslationKey>[] = [
        {
            limit: 30,
            score: this.getLowestPossibleScore(),
            description: "insights.summary.insights.completedEntriesRatio.veryLow",
        },
        {
            limit: 70,
            score: -5,
            description: "insights.summary.insights.completedEntriesRatio.low",
        },
        {
            limit: 90,
            score: 5,
            description: "insights.summary.insights.completedEntriesRatio.ok",
        },
        {
            limit: Infinity,
            score: this.getHighestPossibleScore(),
            description: "insights.summary.insights.completedEntriesRatio.optimal",
        },
    ];
}

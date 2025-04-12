import { BaseThresholdRatingStrategy } from "@/features/insights/domain/BaseThresholdRatingStrategy.ts";
import { Threshold } from "@/features/insights/domain/ThresholdBasedMetricRatingStrategy.ts";
import { Insight } from "@/features/insights/types/Insights";

type BaseTranslationKey = "insights.summary.insights.currentStreak";
type ScoreKey = "none" | "short" | "subOptimal" | "optimal";
type DescriptionTranslationKey = `${BaseTranslationKey}.${ScoreKey}`;

export class CurrentStreakRatingStrategy extends BaseThresholdRatingStrategy {
    protected readonly key = "current_streak";
    protected readonly minSignificantEntries = 0;

    public constructor(
        private readonly currentDailyStreak: number,
        private readonly totalEntriesAmount: number
    ) {
        super();
    }

    public rate(): Insight | null {
        return this.rateSingleMetric(this.currentDailyStreak, this.totalEntriesAmount);
    }

    public getHighestPossibleScore(): number {
        return -5;
    }

    public getLowestPossibleScore(): number {
        return -10;
    }

    protected readonly thresholds: Threshold<DescriptionTranslationKey>[] = [
        {
            limit: 0,
            score: this.getLowestPossibleScore(),
            description: "insights.summary.insights.currentStreak.none",
        },
        {
            limit: 1,
            score: 3,
            description: "insights.summary.insights.currentStreak.short",
        },
        {
            limit: 3,
            score: 5,
            description: "insights.summary.insights.currentStreak.subOptimal",
        },
        {
            limit: Infinity,
            score: this.getHighestPossibleScore(),
            description: "insights.summary.insights.currentStreak.optimal",
        },
    ];
}

import { BaseThresholdRatingStrategy } from "@/features/insights/domain/BaseThresholdRatingStrategy.ts";
import { Threshold } from "@/features/insights/domain/ThresholdBasedMetricRatingStrategy.ts";
import { Insight } from "@/features/insights/types/Insights";

type BaseTranslationKey = "insights.summary.insights.featuredEntriesRatio";
type ScoreKey = "tooLow" | "subOptimal" | "optimal" | "aboveOptimal" | "tooHigh";
type DescriptionTranslationKey = `${BaseTranslationKey}.${ScoreKey}`;

export class FeaturedEntriesRatingStrategy extends BaseThresholdRatingStrategy {
    protected readonly key = "featured_entries_ratio";
    protected readonly minSignificantEntries = 10;

    public constructor(
        private readonly featuredEntriesRatio: number,
        private readonly totalEntriesAmount: number
    ) {
        super();
    }

    public rate(): Insight | null {
        return this.rateSingleMetric(this.featuredEntriesRatio, this.totalEntriesAmount);
    }

    public getHighestPossibleScore(): number {
        return 10;
    }

    public getLowestPossibleScore(): number {
        return -10;
    }

    protected readonly thresholds: Threshold<DescriptionTranslationKey>[] = [
        {
            limit: 0,
            score: this.getLowestPossibleScore(),
            description: "insights.summary.insights.featuredEntriesRatio.tooLow",
        },
        {
            limit: 3,
            score: 5,
            description: "insights.summary.insights.featuredEntriesRatio.subOptimal",
        },
        {
            limit: 15,
            score: this.getHighestPossibleScore(),
            description: "insights.summary.insights.featuredEntriesRatio.optimal",
        },
        {
            limit: 35,
            score: -5,
            description: "insights.summary.insights.featuredEntriesRatio.aboveOptimal",
        },
        {
            limit: Infinity,
            score: this.getLowestPossibleScore(),
            description: "insights.summary.insights.featuredEntriesRatio.tooHigh",
        },
    ];
}

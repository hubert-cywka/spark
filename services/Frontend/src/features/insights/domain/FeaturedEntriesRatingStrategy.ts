import { BaseThresholdRatingStrategy } from "@/features/insights/domain/BaseThresholdRatingStrategy.ts";
import { Threshold } from "@/features/insights/domain/ThresholdBasedMetricRatingStrategy.ts";

export class FeaturedEntriesRatingStrategy extends BaseThresholdRatingStrategy {
    protected readonly key = "featured_entries_ratio";
    private readonly minSignificantEntries = 10;

    public constructor(
        private readonly featuredEntriesRatio: number,
        private readonly totalEntriesAmount: number
    ) {
        super();
    }

    public rate() {
        if (this.minSignificantEntries > this.totalEntriesAmount) {
            return null;
        }

        return this.rateSingleMetric(this.featuredEntriesRatio);
    }

    public getHighestPossibleScore(): number {
        return 10;
    }

    public getLowestPossibleScore(): number {
        return -10;
    }

    protected readonly thresholds: Threshold[] = [
        {
            limit: 0,
            score: {
                value: this.calculateScore(0),
                key: "too_low",
            },
        },
        {
            limit: 2,
            score: {
                value: this.calculateScore(33),
                key: "slightly_too_low",
            },
        },
        {
            limit: 5,
            score: {
                value: this.calculateScore(66),
                key: "slightly_below_optimal",
            },
        },
        {
            limit: 15,
            score: {
                value: this.calculateScore(100),
                key: "optimal",
            },
        },
        {
            limit: 35,
            score: {
                value: this.calculateScore(33),
                key: "slightly_too_high",
            },
        },
        {
            limit: Infinity,
            score: {
                value: this.calculateScore(0),
                key: "too_high",
            },
        },
    ];
}

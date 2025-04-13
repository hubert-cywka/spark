import { BaseThresholdRatingStrategy } from "@/features/insights/domain/BaseThresholdRatingStrategy.ts";
import { Threshold } from "@/features/insights/domain/ThresholdBasedMetricRatingStrategy.ts";

export class CompletedEntriesRatingStrategy extends BaseThresholdRatingStrategy {
    protected readonly key = "completed_entries_ratio";
    private readonly minSignificantEntries = 10;

    public constructor(
        private readonly completedEntriesRatio: number,
        private readonly totalEntriesAmount: number
    ) {
        super();
    }

    public rate() {
        if (this.minSignificantEntries > this.totalEntriesAmount) {
            return null;
        }

        return this.rateSingleMetric(this.completedEntriesRatio);
    }

    public getHighestPossibleScore(): number {
        return 10;
    }

    public getLowestPossibleScore(): number {
        return -10;
    }

    protected thresholds: Threshold[] = [
        {
            limit: 30,
            score: {
                value: this.calculateScore(0),
                key: "too_low",
            },
        },
        {
            limit: 70,
            score: {
                value: this.calculateScore(25),
                key: "slightly_too_low",
            },
        },
        {
            limit: 90,
            score: {
                value: this.calculateScore(75),
                key: "slightly_below_optimal",
            },
        },
        {
            limit: Infinity,
            score: {
                value: this.calculateScore(100),
                key: "optimal",
            },
        },
    ];
}

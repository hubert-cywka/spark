import { BaseThresholdRatingStrategy } from "@/features/insights/domain/BaseThresholdRatingStrategy.ts";
import { Threshold } from "@/features/insights/domain/ThresholdBasedMetricRatingStrategy.ts";

export class ActiveDayRateRatingStrategy extends BaseThresholdRatingStrategy {
    protected readonly key = "active_day_rate";

    public constructor(private readonly activityRate: number) {
        super();
    }

    public rate() {
        return this.rateSingleMetric(this.activityRate);
    }

    public getHighestPossibleScore(): number {
        return 10;
    }

    public getLowestPossibleScore(): number {
        return -10;
    }

    protected readonly thresholds: Threshold[] = [
        {
            limit: 15,
            score: {
                value: this.calculateScore(0),
                key: "too_low",
            },
        },
        {
            limit: 40,
            score: {
                value: this.calculateScore(33),
                key: "slightly_too_low",
            },
        },
        {
            limit: 70,
            score: {
                value: this.calculateScore(66),
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

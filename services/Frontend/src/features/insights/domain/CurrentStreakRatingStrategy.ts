import { BaseThresholdRatingStrategy } from "@/features/insights/domain/BaseThresholdRatingStrategy.ts";
import { Threshold } from "@/features/insights/domain/ThresholdBasedMetricRatingStrategy.ts";

export class CurrentStreakRatingStrategy extends BaseThresholdRatingStrategy {
    protected readonly key = "current_streak";

    public constructor(private readonly currentDailyStreak: number) {
        super();
    }

    public rate() {
        return this.rateSingleMetric(this.currentDailyStreak);
    }

    public getHighestPossibleScore(): number {
        return 10;
    }

    public getLowestPossibleScore(): number {
        return -5;
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
            limit: 1,
            score: {
                value: this.calculateScore(50),
                key: "slightly_too_low",
            },
        },
        {
            limit: 3,
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

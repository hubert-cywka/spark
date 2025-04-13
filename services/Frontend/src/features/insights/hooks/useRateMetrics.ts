import {
    CompletedEntriesRatingStrategy,
    CurrentStreakRatingStrategy,
    FeaturedEntriesRatingStrategy,
    ThresholdBasedRatingStrategy,
} from "@/features/insights/domain";
import { ActiveDayRateRatingStrategy } from "@/features/insights/domain/ActiveDayRateRatingStrategy.ts";
import { Insight, MetricsRatingData, RawInsight } from "@/features/insights/types/Insights";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { normalize } from "@/utils/normalize.ts";

const BASE_SCORE = 50;

type UseRateMetricsOptions = {
    enabled?: boolean;
    data: MetricsRatingData;
};

// TODO: Move rating logic to backend
export const useRateMetrics = ({ data, enabled = true }: UseRateMetricsOptions) => {
    const t = useTranslate();

    const strategies: ThresholdBasedRatingStrategy[] = [
        new CompletedEntriesRatingStrategy(data.completedEntriesRatio, data.totalEntriesAmount),
        new FeaturedEntriesRatingStrategy(data.featuredEntriesRatio, data.totalEntriesAmount),
        new ActiveDayRateRatingStrategy(data.activeDayRate),
    ];

    if (data.currentDailyStreak !== null) {
        strategies.push(new CurrentStreakRatingStrategy(data.currentDailyStreak));
    }

    const insights = strategies.map((strategy) => strategy.rate());

    const meaningfulInsights: Insight[] = insights
        .filter((i) => isDefined<RawInsight>(i))
        .map((insight) => ({
            key: insight.key,
            score: insight.score.value,
            description: t(`insights.summary.insights.${insight.key}.${insight.score.key}`),
        }));

    const minPossibleScore = BASE_SCORE + strategies.reduce((sum, strategy) => sum + strategy.getLowestPossibleScore(), 0);
    const maxPossibleScore = BASE_SCORE + strategies.reduce((sum, strategy) => sum + strategy.getHighestPossibleScore(), 0);
    const rawScore = BASE_SCORE + meaningfulInsights.reduce((sum, insight) => sum + insight.score, 0);
    const normalizedScore = normalize(rawScore, {
        min: minPossibleScore,
        max: maxPossibleScore,
    });

    return {
        insights: meaningfulInsights,
        score: normalizedScore,
        ready: enabled,
    };
};

const isDefined = <T>(value: unknown): value is T => {
    return !!value;
};

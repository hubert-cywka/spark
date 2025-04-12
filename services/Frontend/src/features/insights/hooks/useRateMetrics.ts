import {
    CompletedEntriesRatingStrategy,
    CurrentStreakRatingStrategy,
    FeaturedEntriesRatingStrategy,
    ThresholdBasedRatingStrategy,
} from "@/features/insights/domain";
import { Insight, MetricsRatingData } from "@/features/insights/types/Insights";
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
        new CurrentStreakRatingStrategy(data.currentDailyStreak, data.totalEntriesAmount),
    ];

    const insights = strategies.map((strategy) => strategy.rate());

    const meaningfulInsights = insights
        .filter((insight): insight is Insight => insight !== null)
        .map((insight) => ({
            ...insight,
            description: t(insight.description),
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

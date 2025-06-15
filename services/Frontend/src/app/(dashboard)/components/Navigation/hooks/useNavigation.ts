import { useMemo } from "react";
import { Bell, Calendar, Lightbulb, Target, User } from "lucide-react";

import { AppRoute } from "@/app/appRoute";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { IconComponent } from "@/types/Icon";

type UseAppNavigation = {
    sections: NavigationSectionConfig[];
};

type NavigationSectionConfig = {
    label: string;
    routes: {
        target: AppRoute;
        label: string;
        icon: IconComponent;
    }[];
};

export const useNavigation = (): UseAppNavigation => {
    const t = useTranslate();

    const sections: NavigationSectionConfig[] = useMemo(
        (): NavigationSectionConfig[] => [
            {
                label: t("common.navigation.sections.journal.label"),
                routes: [
                    {
                        target: AppRoute.DAILY,
                        label: t("common.navigation.sections.journal.daily.label"),
                        icon: Calendar,
                    },
                    {
                        target: AppRoute.GOALS,
                        label: t("common.navigation.sections.journal.goals.label"),
                        icon: Target,
                    },
                    {
                        target: AppRoute.INSIGHTS,
                        label: t("common.navigation.sections.journal.insights.label"),
                        icon: Lightbulb,
                    },
                ],
            },
            {
                label: t("common.navigation.sections.settings.label"),
                routes: [
                    {
                        target: AppRoute.ALERTS,
                        label: t("common.navigation.sections.settings.alerts.label"),
                        icon: Bell,
                    },
                    {
                        target: AppRoute.PROFILE,
                        label: t("common.navigation.sections.settings.profile.label"),
                        icon: User,
                    },
                ],
            },
        ],
        [t]
    );

    return {
        sections,
    };
};

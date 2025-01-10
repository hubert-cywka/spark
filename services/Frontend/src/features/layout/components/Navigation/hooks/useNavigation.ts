import { useMemo } from "react";
import { IconCalendar, IconHome, IconLogin, IconTarget, IconUserPlus } from "@tabler/icons-react";

import { AppRoute } from "@/app/appRoute";
import { AccessScope } from "@/features/auth/types/Identity";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { IconComponent } from "@/types/Icon";

type UseAppNavigation = {
    sections: NavigationSectionConfig[];
};

type NavigationSectionConfig = {
    label: string;
    requiredScopes: AccessScope[];
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
                label: t("common.navigation.sections.main.label"),
                requiredScopes: [],
                routes: [
                    {
                        target: AppRoute.HOME,
                        label: t("common.navigation.sections.main.home.label"),
                        icon: IconHome,
                    },
                ],
            },
            {
                label: t("common.navigation.sections.journal.label"),
                requiredScopes: ["browse_as_authenticated"],
                routes: [
                    {
                        target: AppRoute.DAILY,
                        label: t("common.navigation.sections.journal.daily.label"),
                        icon: IconCalendar,
                    },
                    {
                        target: AppRoute.GOALS,
                        label: t("common.navigation.sections.journal.goals.label"),
                        icon: IconTarget,
                    },
                ],
            },
            {
                label: t("common.navigation.sections.auth.label"),
                requiredScopes: ["browse_as_unauthenticated"],
                routes: [
                    {
                        target: AppRoute.LOGIN,
                        label: t("common.navigation.sections.auth.login.label"),
                        icon: IconLogin,
                    },
                    {
                        target: AppRoute.REGISTER,
                        label: t("common.navigation.sections.auth.register.label"),
                        icon: IconUserPlus,
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

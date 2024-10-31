import { useMemo } from "react";
import { IconHome, IconLogin, IconUserPlus } from "@tabler/icons-react";

import { AppRoute } from "@/app/appRoute";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { IconComponent } from "@/types/Icon";

type UseAppNavigation = {
    sections: {
        label: string;
        routes: {
            target: AppRoute;
            label: string;
            icon: IconComponent;
        }[];
    }[];
};

export const useNavigation = (): UseAppNavigation => {
    const t = useTranslate();

    const sections = useMemo(
        () => [
            {
                label: t("common.navigation.sections.main.label"),
                routes: [
                    {
                        target: AppRoute.HOME,
                        label: t("common.navigation.sections.main.home.label"),
                        icon: IconHome,
                    },
                ],
            },
            {
                label: t("common.navigation.sections.auth.label"),
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

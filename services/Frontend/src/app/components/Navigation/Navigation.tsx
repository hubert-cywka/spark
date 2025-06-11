"use client";

import classNames from "clsx";

import styles from "./styles/Navigation.module.scss";

import { AppRoute } from "@/app/appRoute.ts";
import { NavigationItem } from "@/app/components/Navigation/components/NavigationItem/NavigationItem.tsx";
import { Logo } from "@/components/Logo";
import { AccessGuard } from "@/features/auth/components/AccessGuard";
import { useSpotlight } from "@/hooks/useSpotlight.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const Navigation = () => {
    const t = useTranslate();
    const { ref, handleMouseMove, spotlightClassName } = useSpotlight();

    return (
        <nav className={classNames(styles.navigation, spotlightClassName)} ref={ref} onMouseMove={handleMouseMove}>
            <div className={styles.container}>
                <Logo />

                <div className={styles.routes}>
                    <AccessGuard requiredScopes={["browse_as_unauthenticated"]}>
                        <NavigationItem href={AppRoute.LOGIN} label={t("common.navigation.sections.auth.login.label")} />
                        <NavigationItem href={AppRoute.REGISTER} label={t("common.navigation.sections.auth.register.label")} />
                    </AccessGuard>

                    <AccessGuard requiredScopes={["browse_as_authenticated"]}>
                        <NavigationItem href={AppRoute.DAILY} label={t("common.navigation.sections.dashboard.label")} />
                        <NavigationItem href={AppRoute.SETTINGS} label={t("common.navigation.sections.settings.label")} />
                    </AccessGuard>

                    <NavigationItem
                        href={AppRoute.TERMS_AND_CONDITIONS}
                        label={t("common.navigation.sections.legal.termsAndConditions.label")}
                    />
                </div>
            </div>
        </nav>
    );
};

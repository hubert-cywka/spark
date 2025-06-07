"use client";

import { useCallback, useState } from "react";
import clsx from "clsx";
import { ChevronLeft } from "lucide-react";

import styles from "./styles/SidePanel.module.scss";

import { IconButton } from "@/components/IconButton/";
import { Logo } from "@/components/Logo/Logo";
import { AccessGuard } from "@/features/auth/components/AccessGuard";
import { LogoutButton } from "@/features/auth/components/LogoutButton/LogoutButton";
import { Navigation } from "@/features/layout/components/Navigation/Navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useOutsideClick } from "@/hooks/useOutsideClick.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export const SidePanel = () => {
    const t = useTranslate();
    const isDesktop = useMediaQuery("(min-width: 768px)");
    // Hubert: On mobile this component should be hidden by default. We are using css to achieve that to prevent layout
    // shifts, but the user still needs to be able to open the component. It doesn't matter if we set it to 'true' on
    // initial render on desktop.
    const [isCollapsed, setIsCollapsed] = useState(true);
    const toggleCollapsedState = () => setIsCollapsed((prev) => !prev);
    const collapse = useCallback(() => setIsCollapsed(true), []);

    const ref = useOutsideClick(collapse);

    return (
        <aside
            ref={ref}
            className={clsx(styles.container, {
                [styles.collapsed]: isCollapsed,
            })}
        >
            <div className={styles.sidePanel}>
                <div className={styles.collapseButtonWrapper}>
                    <IconButton
                        size="1"
                        variant="secondary"
                        onPress={toggleCollapsedState}
                        tooltip={t(`common.navigation.collapseButton.label.${isCollapsed ? "show" : "hide"}`)}
                        aria-label={t(`common.navigation.collapseButton.label.${isCollapsed ? "show" : "hide"}`)}
                        iconSlot={ChevronLeft}
                    />
                </div>

                <header className={styles.logoWrapper}>
                    <Logo />
                </header>

                <Navigation isDisabled={isCollapsed && !isDesktop} />

                <footer className={styles.footer}>
                    <AccessGuard requiredScopes={["browse_as_authenticated"]}>
                        <LogoutButton />
                    </AccessGuard>
                </footer>
            </div>
        </aside>
    );
};

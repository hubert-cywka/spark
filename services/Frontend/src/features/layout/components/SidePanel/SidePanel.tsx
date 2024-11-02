"use client";

import { useCallback, useEffect, useState } from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import clsx from "clsx";

import styles from "./styles/SidePanel.module.scss";

import { IconButton } from "@/components/IconButton/";
import { Logo } from "@/components/Logo/Logo";
import { Navigation } from "@/features/layout/components/Navigation/Navigation";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export const SidePanel = () => {
    const t = useTranslate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapsedState = () => setIsCollapsed((prev) => !prev);

    const autoExpandOnDesktop = useCallback(() => {
        if (window.innerWidth >= 768) {
            setIsCollapsed(false);
        }
    }, []);

    useEffect(autoExpandOnDesktop, [autoExpandOnDesktop]);

    return (
        <div
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
                        aria-label={t(`common.navigation.collapseButton.label.${isCollapsed ? "show" : "hide"}`)}
                    >
                        <IconChevronLeft />
                    </IconButton>
                </div>

                <Logo />
                <Navigation isDisabled={isCollapsed} />
            </div>
        </div>
    );
};

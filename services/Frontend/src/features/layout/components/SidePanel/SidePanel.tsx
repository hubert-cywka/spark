"use client";

import { useCallback, useEffect, useState } from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import clsx from "clsx";

import styles from "./styles/SidePanel.module.scss";

import { IconButton } from "@/components/iconButton/IconButton";
import { Logo } from "@/components/logo/Logo";
import { Navigation } from "@/features/layout/components/Navigation/Navigation";

export const SidePanel = () => {
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
                    <IconButton size="1" variant="subtle" onPress={toggleCollapsedState}>
                        <IconChevronLeft />
                    </IconButton>
                </div>

                <Logo />
                <Navigation />
            </div>
        </div>
    );
};

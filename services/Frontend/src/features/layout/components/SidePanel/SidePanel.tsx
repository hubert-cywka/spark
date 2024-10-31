"use client";

import { useState } from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import clsx from "clsx";

import styles from "./styles/SidePanel.module.scss";

import { IconButton } from "@/components/iconButton/IconButton";
import { Logo } from "@/components/logo/Logo";
import { Navigation } from "@/features/layout/components/Navigation/Navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const SidePanel = () => {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const [isCollapsed, setIsCollapsed] = useState(isMobile);

    const toggleCollapsedState = () => setIsCollapsed((prev) => !prev);

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

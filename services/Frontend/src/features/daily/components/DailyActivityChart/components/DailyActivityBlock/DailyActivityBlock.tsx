import { cloneElement } from "react";
import { Activity, BlockElement } from "react-activity-calendar";

import styles from "./styles/DailyActivityBlock.module.scss";

import { DAILY_ACTIVITY_BLOCK_TOOLTIP_ID } from "@/features/daily/components/DailyActivityChart/constants";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type DailyActivityBlockProps = {
    block: BlockElement;
    activity: Activity;
    isFocused: boolean;
    isGridFocused: boolean;
};

export const DailyActivityBlock = ({ block, activity, isGridFocused, isFocused }: DailyActivityBlockProps) => {
    const t = useTranslate();

    const blockId = `activity-block-${activity.date}`;
    const tooltipContent = t("daily.activity.chart.tooltip", {
        count: activity.count,
        date: activity.date,
    });

    return cloneElement(block, {
        id: blockId,
        role: "gridcell",
        "aria-label": tooltipContent,
        "aria-selected": isFocused ? "true" : "false",
        "data-tooltip-id": DAILY_ACTIVITY_BLOCK_TOOLTIP_ID,
        "data-tooltip-html": tooltipContent,
        tabIndex: -1,
        className: `${styles.activityBlock} ${isFocused && isGridFocused ? styles.focusedBlock : ""}`,
    });
};

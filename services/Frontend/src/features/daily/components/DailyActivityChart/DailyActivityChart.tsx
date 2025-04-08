"use client";

import ActivityCalendar from "react-activity-calendar";
import { Tooltip } from "react-tooltip";

import styles from "./styles/DailyActivityChart.module.scss";
import "react-tooltip/dist/react-tooltip.css";

import { Card } from "@/components/Card";
import { DailyActivityBlock } from "@/features/daily/components/DailyActivityChart/components/DailyActivityBlock";
import { DAILY_ACTIVITY_BLOCK_TOOLTIP_ID } from "@/features/daily/components/DailyActivityChart/constants";
import { useDailyActivityChartLabels } from "@/features/daily/components/DailyActivityChart/hooks/useDailyActivityChartLabels.ts";
import { useDailyActivityChartNavigation } from "@/features/daily/components/DailyActivityChart/hooks/useDailyActivityChartNavigation.ts";
import { DailyActivity } from "@/features/daily/types/Daily";

const DAY_BLOCK_SIZE = 16;

type DailyActivityChartProps = {
    activity: DailyActivity[];
    onSelectDay?: (date: string) => void;
    isLoading?: boolean;
};

export const DailyActivityChart = ({ activity, onSelectDay, isLoading }: DailyActivityChartProps) => {
    const labels = useDailyActivityChartLabels();
    const { focusedDate, onGridFocus, onGridBlur, onGridKeyDown, isGridFocused, onGridCellClick } = useDailyActivityChartNavigation({
        activity,
        onSelectDay,
    });

    const maxActivity = Math.max(1, ...activity.map(({ entriesCount }) => entriesCount));
    const chartData = activity.map(({ date, entriesCount }) => ({
        date,
        count: entriesCount,
        level: entriesCount,
    }));

    const activeDescendantId = focusedDate ? `activity-block-${focusedDate}` : undefined;

    return (
        <Card
            as="article"
            tabIndex={0}
            variant="semi-translucent"
            className={styles.container}
            onFocus={onGridFocus}
            onBlur={onGridBlur}
            onKeyDown={onGridKeyDown}
            role="grid"
            aria-activedescendant={activeDescendantId}
        >
            <ActivityCalendar
                hideTotalCount
                hideColorLegend
                loading={isLoading}
                maxLevel={maxActivity}
                blockSize={DAY_BLOCK_SIZE}
                eventHandlers={{
                    onClick: (_event) => onGridCellClick,
                }}
                renderBlock={(block, activity) => (
                    <DailyActivityBlock
                        activity={activity}
                        block={block}
                        isGridFocused={isGridFocused}
                        isFocused={focusedDate === activity.date}
                    />
                )}
                labels={labels}
                data={chartData}
                colorScheme="dark"
                theme={{ dark: ["#40404088", "#5500FF"] }}
            />
            <Tooltip id={DAILY_ACTIVITY_BLOCK_TOOLTIP_ID} />
        </Card>
    );
};

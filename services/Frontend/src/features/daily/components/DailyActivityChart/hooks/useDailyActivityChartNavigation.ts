import { KeyboardEvent, useCallback, useMemo, useState } from "react";
import { Activity } from "react-activity-calendar";
import dayjs from "dayjs";

import { DailyActivity } from "@/features/daily/types/Daily";

const DATE_FORMAT = "YYYY-MM-DD";

type UseDailyActivityChartNavigationOptions = {
    activity: DailyActivity[];
    onSelectDay?: (date: string) => void;
};

export const useDailyActivityChartNavigation = ({ activity, onSelectDay }: UseDailyActivityChartNavigationOptions) => {
    const [focusedDate, setFocusedDate] = useState<string | null>(null);
    const [isGridFocused, setIsGridFocused] = useState<boolean>(false);

    const activityMap = useMemo(() => {
        const map = new Map<string, DailyActivity>();
        activity.forEach((a) => map.set(a.date, a));
        return map;
    }, [activity]);

    const sortedDates = useMemo(() => activity.map((a) => a.date).sort(), [activity]);

    const onGridCellClick = (activity: Activity) => {
        onSelectDay?.(activity.date);
        setFocusedDate(activity.date);
    };

    const onGridKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            if (!focusedDate) {
                if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key) && sortedDates.length > 0) {
                    setFocusedDate(sortedDates[sortedDates.length - 1]);
                    event.preventDefault();
                }
                return;
            }

            const currentDate = dayjs(focusedDate);
            let nextDate: dayjs.Dayjs | null = null;

            switch (event.key) {
                case "ArrowUp":
                    nextDate = currentDate.subtract(1, "day");
                    break;
                case "ArrowDown":
                    nextDate = currentDate.add(1, "day");
                    break;
                case "ArrowLeft":
                    nextDate = currentDate.subtract(7, "day");
                    break;
                case "ArrowRight":
                    nextDate = currentDate.add(7, "day");
                    break;
                case "Enter":
                case " ":
                    event.preventDefault();
                    if (activityMap.has(focusedDate)) {
                        onSelectDay?.(focusedDate);
                    }
                    return;
                default:
                    return;
            }

            if (!nextDate) {
                return;
            }

            const nextDateString = nextDate.format(DATE_FORMAT);

            if (!activityMap.has(nextDateString)) {
                return;
            }

            event.preventDefault();
            setFocusedDate(nextDateString);
        },
        [focusedDate, onSelectDay, activityMap, sortedDates]
    );

    const onGridFocus = () => {
        setIsGridFocused(true);

        if (!focusedDate && sortedDates.length > 0) {
            setFocusedDate(sortedDates[sortedDates.length - 1]);
        } else if (focusedDate && !activityMap.has(focusedDate)) {
            setFocusedDate(sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null);
        }
    };

    const onGridBlur = () => {
        setIsGridFocused(false);
    };

    return {
        onGridKeyDown,
        onGridFocus,
        onGridBlur,
        isGridFocused,
        focusedDate,
        onGridCellClick,
    };
};

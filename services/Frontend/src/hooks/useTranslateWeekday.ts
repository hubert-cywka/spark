import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { Day } from "@/types/Day.ts";

export const useTranslateWeekday = () => {
    const t = useTranslate();

    return (day: Day) => {
        switch (day) {
            case Day.SUNDAY:
                return t("common.day.sunday");
            case Day.MONDAY:
                return t("common.day.monday");
            case Day.TUESDAY:
                return t("common.day.tuesday");
            case Day.WEDNESDAY:
                return t("common.day.wednesday");
            case Day.THURSDAY:
                return t("common.day.thursday");
            case Day.FRIDAY:
                return t("common.day.friday");
            case Day.SATURDAY:
                return t("common.day.saturday");
        }
    };
};

import styles from "./styles/DaysSelect.module.scss";

import { Button } from "@/components/Button";
import { Tooltip } from "@/components/Tooltip";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { Day } from "@/types/Day";

const ALL_WEEKDAYS: Day[] = [Day.SUNDAY, Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY, Day.SATURDAY];

type DaysSelectProps = {
    selected: Day[];
    onChange: (selected: Day[]) => void;
};

export const DaysSelect = ({ selected, onChange }: DaysSelectProps) => {
    const t = useTranslate();

    const handleOnChange = (singleValue: Day) => {
        if (selected.includes(singleValue)) {
            onChange(selected.filter((value) => value !== singleValue));
        } else {
            onChange([...selected, singleValue]);
        }
    };

    const translateWeekday = (day: Day) => {
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

    return (
        <div className={styles.container}>
            {ALL_WEEKDAYS.map((day) => (
                <Tooltip label={translateWeekday(day)} key={day}>
                    <Button
                        onPress={() => handleOnChange(day)}
                        variant={selected.includes(day) ? "primary" : "secondary"}
                        className={styles.dayButton}
                        size="1"
                    >
                        {translateWeekday(day).charAt(0).toUpperCase()}
                    </Button>
                </Tooltip>
            ))}
        </div>
    );
};

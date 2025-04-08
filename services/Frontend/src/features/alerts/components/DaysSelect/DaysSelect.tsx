import styles from "./styles/DaysSelect.module.scss";

import { Button } from "@/components/Button";
import { Tooltip } from "@/components/Tooltip";
import { useTranslateWeekday } from "@/hooks/useTranslateWeekday.ts";
import { Day } from "@/types/Day";

const ALL_WEEKDAYS: Day[] = [Day.SUNDAY, Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY, Day.SATURDAY];

type DaysSelectProps = {
    selected: Day[];
    onChange: (selected: Day[]) => void;
};

export const DaysSelect = ({ selected, onChange }: DaysSelectProps) => {
    const translateWeekday = useTranslateWeekday();

    const handleOnChange = (singleValue: Day) => {
        if (selected.includes(singleValue)) {
            onChange(selected.filter((value) => value !== singleValue));
        } else {
            onChange([...selected, singleValue]);
        }
    };

    return (
        <ul className={styles.container}>
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
        </ul>
    );
};

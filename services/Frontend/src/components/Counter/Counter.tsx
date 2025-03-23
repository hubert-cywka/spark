import SlotCounter from "react-slot-counter";

import styles from "./styles/Counter.module.scss";

type CounterProps = {
    value: number;
    countDuration?: number;
};

export const Counter = ({ value, countDuration = 1.5 }: CounterProps) => {
    return (
        <SlotCounter
            charClassName={styles.slot}
            duration={countDuration}
            slotPeek={10}
            value={value}
            startValue={0}
            startValueOnce
            useMonospaceWidth
            startFromLastDigit
            animateOnVisible={{
                triggerOnce: true,
            }}
        />
    );
};

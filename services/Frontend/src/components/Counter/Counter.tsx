import SlotCounter from "react-slot-counter";

import styles from "./styles/Counter.module.scss";

const DEFAULT_DURATION = 1;
const DEFAULT_CHARACTERS_TO_ROTATE = 3;

type CounterProps = {
    value: number;
    countDuration?: number;
};

export const Counter = ({ value, countDuration = DEFAULT_DURATION }: CounterProps) => {
    return (
        <SlotCounter
            charClassName={styles.slot}
            separatorClassName={styles.slot}
            duration={countDuration}
            dummyCharacterCount={DEFAULT_CHARACTERS_TO_ROTATE}
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

import { useEffect, useState } from "react";
import dayjs from "dayjs";

export const useCountdown = () => {
    const [targetDate, setTargetDate] = useState<number | null>(null);
    const [remainingSeconds, setRemainingSeconds] = useState(0);

    useEffect(() => {
        if (targetDate === null) {
            setRemainingSeconds(0);
            return;
        }

        const initialDiff = Math.floor((targetDate - new Date().getTime()) / 1000);
        setRemainingSeconds(Math.max(0, initialDiff));

        if (initialDiff <= 0) {
            setTargetDate(null);
            return;
        }

        const interval = setInterval(() => {
            const diff = Math.floor((targetDate - new Date().getTime()) / 1000);

            if (diff > 0) {
                setRemainingSeconds(diff);
            } else {
                setRemainingSeconds(0);
                setTargetDate(null);
            }
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [targetDate]);

    const startCountdown = (seconds: number) => {
        if (seconds <= 0) {
            setRemainingSeconds(0);
            setTargetDate(null);
            return;
        }

        const newTargetDate = dayjs().add(seconds, "seconds").toDate().getTime();
        setTargetDate(newTargetDate);
    };

    return [remainingSeconds, startCountdown] as const;
};

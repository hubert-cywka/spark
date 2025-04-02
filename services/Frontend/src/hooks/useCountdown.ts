import { useEffect, useState } from "react";

export const useCountdown = () => {
    const [seconds, setSeconds] = useState<number>(0);

    useEffect(() => {
        if (seconds <= 0) {
            return;
        }

        const timer = setInterval(() => setSeconds((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [seconds]);

    return [seconds, setSeconds] as const;
};

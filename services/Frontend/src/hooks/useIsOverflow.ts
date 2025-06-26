import { useLayoutEffect, useRef, useState } from "react";

export const useIsOverflow = <T extends HTMLElement>() => {
    const ref = useRef<T | null>(null);
    const [isOverflow, setIsOverflow] = useState<boolean | undefined>(undefined);

    useLayoutEffect(() => {
        const { current } = ref;

        if (!current) {
            return;
        }

        const checkForOverflow = () => {
            const hasOverflow = current.scrollWidth > current.clientWidth;
            setIsOverflow((prev) => (prev !== hasOverflow ? hasOverflow : prev));
        };

        const observer = new ResizeObserver(() => {
            checkForOverflow();
        });

        observer.observe(current);
        checkForOverflow();

        return () => {
            observer.disconnect();
        };
    }, []);

    return { ref, isOverflow };
};

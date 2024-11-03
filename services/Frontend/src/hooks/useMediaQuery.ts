import { useCallback, useLayoutEffect, useState } from "react";

export const useMediaQuery = (mediaQuery: string) => {
    const [targetReached, setTargetReached] = useState(false);

    const updateTarget = useCallback((e: MediaQueryListEvent) => {
        setTargetReached(e.matches);
    }, []);

    useLayoutEffect(() => {
        const media = window.matchMedia(mediaQuery);
        media.addEventListener("change", updateTarget);

        if (media.matches) {
            setTargetReached(true);
        }

        return () => media.removeEventListener("change", updateTarget);
    }, [updateTarget, mediaQuery]);

    return targetReached;
};

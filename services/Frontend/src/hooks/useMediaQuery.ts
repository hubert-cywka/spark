import { useState } from "react";

import { useEventListener } from "@/hooks/useEventListener";

type UseMediaQueryOptions = {
    minWidth?: number;
    maxWidth?: number;
};

export const useMediaQuery = ({ maxWidth, minWidth }: UseMediaQueryOptions): boolean => {
    const [width, setWidth] = useState(window.innerWidth);

    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    };

    useEventListener("resize", handleWindowSizeChange);

    if (maxWidth && minWidth) {
        return width >= minWidth && width <= maxWidth;
    }

    if (maxWidth) {
        return width <= maxWidth;
    }

    if (minWidth) {
        return width >= minWidth;
    }

    return false;
};

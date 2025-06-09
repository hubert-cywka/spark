import { MouseEventHandler, useRef } from "react";

import styles from "./styles/useSpotlight.module.scss";

type UseSpotlightOptions = {
    spotlightOpacity?: number;
};

export const useSpotlight = ({ spotlightOpacity = 0.15 }: UseSpotlightOptions = {}) => {
    const ref = useRef<HTMLElement>(null);

    const handleMouseMove: MouseEventHandler<HTMLElement> = (e) => {
        if (!ref.current) {
            return;
        }

        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ref.current.style.setProperty("--mouse-x", `${x}px`);
        ref.current.style.setProperty("--mouse-y", `${y}px`);
        ref.current.style.setProperty("--spotlight-opacity", `${spotlightOpacity}`);
    };

    return { ref, handleMouseMove, spotlightClassName: styles.spotlight };
};

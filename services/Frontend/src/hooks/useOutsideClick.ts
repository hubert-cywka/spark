import { useCallback, useRef } from "react";

import { useEventListener } from "@/hooks/useEventListener";

export const useOutsideClick = <T extends HTMLElement>(callback: () => unknown) => {
    const ref = useRef<T | null>(null);

    const handleClick = useCallback(
        (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        },
        [callback]
    );

    useEventListener("click", handleClick, true);

    return ref;
};

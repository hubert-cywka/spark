import { useEffect } from "react";

export const useEventListener = <T extends keyof WindowEventMap>(
    type: T,
    listener: (this: Window, ev: WindowEventMap[T]) => unknown,
    options?: boolean | AddEventListenerOptions
) => {
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener(type, listener, options);
            return () => window.removeEventListener(type, listener, options);
        }
    }, [listener, options, type]);
};

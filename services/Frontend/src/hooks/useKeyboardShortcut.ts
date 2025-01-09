import { useCallback } from "react";

import { useEventListener } from "@/hooks/useEventListener";

interface UseKeyboardShortcutOptions {
    keys: string[];
    callback: () => void;
    ctrlKey?: boolean;
    altKey?: boolean;
    shiftKey?: boolean;
    metaKey?: boolean;
}

export const useKeyboardShortcut = ({
    keys,
    callback,
    ctrlKey = false,
    altKey = false,
    shiftKey = false,
    metaKey = false,
}: UseKeyboardShortcutOptions): void => {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (
                keys.includes(event.key) &&
                event.ctrlKey === ctrlKey &&
                event.altKey === altKey &&
                event.shiftKey === shiftKey &&
                event.metaKey === metaKey
            ) {
                event.preventDefault();
                callback();
            }
        },
        [altKey, callback, ctrlKey, keys, metaKey, shiftKey]
    );

    useEventListener("keydown", handleKeyDown);
};

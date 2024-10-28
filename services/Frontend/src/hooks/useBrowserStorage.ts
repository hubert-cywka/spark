import { useCallback, useState } from "react";

import { useEventListener } from "@/hooks/useEventListener";
import { logger } from "@/lib/logger/logger";

const LOCAL_STORAGE_CUSTOM_EVENT_NAME = "local-storage";

declare global {
    interface WindowEventMap {
        [LOCAL_STORAGE_CUSTOM_EVENT_NAME]: CustomEvent;
    }
}

type UseBrowserStorage<T> = [T | null, (value: T | null) => void];

export function useBrowserStorage<T>(key: string): UseBrowserStorage<T> {
    const getFromStorage = useCallback((): T | null => {
        try {
            const raw = window.localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            logger.warn({ msg: "Error reading localStorage item", key, error });
            return null;
        }
    }, [key]);

    const saveInStorage = useCallback(
        (value: T | null) => {
            try {
                window.localStorage.setItem(key, JSON.stringify(value));
                window.dispatchEvent(new StorageEvent(LOCAL_STORAGE_CUSTOM_EVENT_NAME, { key }));
            } catch (error) {
                logger.warn({
                    msg: "Error setting localStorage item",
                    key,
                    error,
                });
            }
        },
        [key]
    );

    const [state, setState] = useState<T | null>(() => getFromStorage());

    const handleStorageChange = useCallback(
        (event: StorageEvent | CustomEvent) => {
            if ((event as StorageEvent).key && (event as StorageEvent).key !== key) {
                return;
            }
            setState(getFromStorage());
        },
        [getFromStorage, key]
    );

    useEventListener("storage", handleStorageChange);
    useEventListener(LOCAL_STORAGE_CUSTOM_EVENT_NAME, handleStorageChange);

    return [state, saveInStorage];
}

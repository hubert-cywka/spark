import { useEffect, useRef, useState } from "react";

import { Entry } from "@/features/entries/types/Entry";

const NEW_ENTRY_THRESHOLD_IN_MS = 5000;
const FLAG_THRESHOLD_IN_MS = 3000;

export const useDetectEntryCreation = (entry: Entry) => {
    const [wasCreated, setWasCreated] = useState(false);
    const hasChecked = useRef(false);

    useEffect(() => {
        if (!hasChecked.current) {
            const isNew = entry.createdAt && Date.now() - new Date(entry.createdAt).getTime() < NEW_ENTRY_THRESHOLD_IN_MS;

            if (isNew) {
                setWasCreated(true);
                const timer = setTimeout(() => setWasCreated(false), FLAG_THRESHOLD_IN_MS);
                return () => clearTimeout(timer);
            }

            hasChecked.current = true;
        }
    }, [entry.createdAt]);

    return { wasCreated };
};

import { useState } from "react";

export const useDailyEntriesPlaceholders = () => {
    const [placeholders, setPlaceholders] = useState<string[]>([]);

    const toUnique = (placeholders: string[]) => {
        return [...new Set(placeholders)];
    };

    const removePlaceholder = (dailyId: string) => {
        setPlaceholders((prev) => toUnique(prev.filter((id) => id !== dailyId)));
    };

    const addPlaceholder = (dailyId: string) => {
        setPlaceholders((prev) => toUnique([...prev, dailyId]));
    };

    return { placeholders, removePlaceholder, addPlaceholder };
};

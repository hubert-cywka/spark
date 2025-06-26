import { useCallback, useState } from "react";

export const useEntriesDataGridGroups = () => {
    const [activeGroups, setActiveGroups] = useState<string[]>([]);

    const onColumnGrouped = useCallback((key: string) => {
        setActiveGroups((prev) => [...prev, key]);
    }, []);

    const onColumnUngrouped = useCallback((key: string) => {
        setActiveGroups((prev) => [...prev.filter((k) => k !== key)]);
    }, []);

    const clearActiveGroups = useCallback(() => {
        setActiveGroups([]);
    }, []);

    return {
        activeGroups,
        onColumnGrouped,
        onColumnUngrouped,
        clearActiveGroups,
    };
};

import { KeyboardEvent } from "react";

import { DailyEntryNavigationOptions } from "@/features/entries/components/DailyEntry/components/shared/DailyEntryComponent";

export function handleDailyEntryComponentsNavigation<T extends HTMLElement>(
    e: KeyboardEvent<T>,
    { onNavigateUp, onNavigateRight, onNavigateLeft, onNavigateDown }: DailyEntryNavigationOptions
) {
    if (e.key === "ArrowUp") {
        e.preventDefault();
        onNavigateUp?.();
        return;
    }

    if (e.key === "ArrowRight") {
        e.preventDefault();
        onNavigateRight?.();
        return;
    }

    if (e.key === "ArrowLeft") {
        e.preventDefault();
        onNavigateLeft?.();
        return;
    }

    if (e.key === "ArrowDown") {
        e.preventDefault();
        onNavigateDown?.();
    }
}

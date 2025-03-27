import { useState } from "react";
import { SquareCheckBigIcon, SquareIcon, StarIcon, StarOffIcon } from "lucide-react";

import styles from "./styles/EntryFiltersGroup.module.scss";

import { IconToggleButton } from "@/components/IconToggleButton/IconToggleButton.tsx";
import { ToggleButtonGroup } from "@/components/ToggleButtonGroup";
import { EntryFilters } from "@/features/entries/types/Entry";

enum EntryFeaturedFilter {
    ONLY_FEATURED = "featured",
    WITHOUT_FEATURED = "not_featured",
}

enum EntryCompletedFilter {
    ONLY_COMPLETED = "completed",
    WITHOUT_COMPLETED = "not_completed",
}

type EntryFiltersGroupProps = {
    onFiltersChange: (value: EntryFilters) => void;
    size?: "1" | "2" | "3";
};

export const EntryFiltersGroup = ({ onFiltersChange, size = "2" }: EntryFiltersGroupProps) => {
    const [featured, setFeatured] = useState<boolean | undefined>();
    const [completed, setCompleted] = useState<boolean | undefined>();

    const onCompletedFiltersChange = (keys: Set<string | number>) => {
        if (keys.has(EntryCompletedFilter.ONLY_COMPLETED)) {
            setCompleted(true);
            onFiltersChange({ completed: true, featured });
        } else if (keys.has(EntryCompletedFilter.WITHOUT_COMPLETED)) {
            setCompleted(false);
            onFiltersChange({ completed: false, featured });
        } else {
            setCompleted(undefined);
            onFiltersChange({ featured });
        }
    };

    const onFeaturedFiltersChange = (keys: Set<string | number>) => {
        if (keys.has(EntryFeaturedFilter.ONLY_FEATURED)) {
            setFeatured(true);
            onFiltersChange({ featured: true, completed });
        } else if (keys.has(EntryFeaturedFilter.WITHOUT_FEATURED)) {
            setFeatured(false);
            onFiltersChange({ featured: false, completed });
        } else {
            setFeatured(undefined);
            onFiltersChange({ completed });
        }
    };

    return (
        <div className={styles.entriesFilters}>
            <ToggleButtonGroup onSelectionChange={onCompletedFiltersChange}>
                <IconToggleButton size={size} id={EntryCompletedFilter.WITHOUT_COMPLETED} iconSlot={SquareIcon} />
                <IconToggleButton size={size} id={EntryCompletedFilter.ONLY_COMPLETED} iconSlot={SquareCheckBigIcon} />
            </ToggleButtonGroup>

            <ToggleButtonGroup onSelectionChange={onFeaturedFiltersChange}>
                <IconToggleButton size={size} id={EntryFeaturedFilter.WITHOUT_FEATURED} iconSlot={StarOffIcon} />
                <IconToggleButton size={size} id={EntryFeaturedFilter.ONLY_FEATURED} iconSlot={StarIcon} />
            </ToggleButtonGroup>
        </div>
    );
};

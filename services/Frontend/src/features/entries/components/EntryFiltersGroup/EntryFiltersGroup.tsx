"use client";

import { useState } from "react";
import classNames from "clsx";
import { RotateCcwIcon, SquareCheckBigIcon, SquareIcon, StarIcon, StarOffIcon } from "lucide-react";

import styles from "./styles/EntryFiltersGroup.module.scss";

import { IconButton } from "@/components/IconButton";
import { IconToggleButton } from "@/components/IconToggleButton/IconToggleButton.tsx";
import { ToggleButtonGroup } from "@/components/ToggleButtonGroup";
import { EntryFilters } from "@/features/entries/types/Entry";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

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
    withReset?: boolean;
    size?: "1" | "2" | "3";
    className?: string;
};

export const EntryFiltersGroup = ({ onFiltersChange, withReset, className, size = "2" }: EntryFiltersGroupProps) => {
    const t = useTranslate();
    const [filters, setFilters] = useState<EntryFilters>({});

    const completedKeys = new Set(
        getActiveKeys(filters.completed, EntryCompletedFilter.ONLY_COMPLETED, EntryCompletedFilter.WITHOUT_COMPLETED)
    );

    const featuredKeys = new Set(getActiveKeys(filters.featured, EntryFeaturedFilter.ONLY_FEATURED, EntryFeaturedFilter.WITHOUT_FEATURED));

    const isAnyFilterSelected = filters.completed !== undefined || filters.featured !== undefined;

    const updateFilters = (patch: EntryFilters) => {
        const nextFilters = { ...filters, ...patch };
        setFilters(nextFilters);
        onFiltersChange(nextFilters);
    };

    const onCompletedFiltersChange = (keys: Set<string | number>) => {
        updateFilters({
            completed: getFilterValue(keys, EntryCompletedFilter.ONLY_COMPLETED, EntryCompletedFilter.WITHOUT_COMPLETED),
        });
    };

    const onFeaturedFiltersChange = (keys: Set<string | number>) => {
        updateFilters({
            featured: getFilterValue(keys, EntryFeaturedFilter.ONLY_FEATURED, EntryFeaturedFilter.WITHOUT_FEATURED),
        });
    };

    const onReset = () => {
        setFilters({});
        onFiltersChange({});
    };

    return (
        <div className={classNames(styles.entriesFilters, className)}>
            <ToggleButtonGroup onSelectionChange={onCompletedFiltersChange} selectedKeys={completedKeys}>
                <IconToggleButton
                    size={size}
                    id={EntryCompletedFilter.WITHOUT_COMPLETED}
                    iconSlot={SquareIcon}
                    tooltip={t("entries.filters.pending")}
                    aria-label={t("entries.filters.pending")}
                />
                <IconToggleButton
                    size={size}
                    id={EntryCompletedFilter.ONLY_COMPLETED}
                    iconSlot={SquareCheckBigIcon}
                    tooltip={t("entries.filters.completed")}
                    aria-label={t("entries.filters.completed")}
                />
            </ToggleButtonGroup>

            <ToggleButtonGroup onSelectionChange={onFeaturedFiltersChange} selectedKeys={featuredKeys}>
                <IconToggleButton
                    size={size}
                    id={EntryFeaturedFilter.WITHOUT_FEATURED}
                    iconSlot={StarOffIcon}
                    tooltip={t("entries.filters.notFeatured")}
                    aria-label={t("entries.filters.notFeatured")}
                />
                <IconToggleButton
                    size={size}
                    id={EntryFeaturedFilter.ONLY_FEATURED}
                    iconSlot={StarIcon}
                    tooltip={t("entries.filters.featured")}
                    aria-label={t("entries.filters.featured")}
                />
            </ToggleButtonGroup>

            {withReset && (
                <IconButton
                    aria-label={t("entries.filters.reset")}
                    tooltip={t("entries.filters.reset")}
                    iconSlot={RotateCcwIcon}
                    size={size}
                    onClick={onReset}
                    isDisabled={!isAnyFilterSelected}
                    variant="primary"
                />
            )}
        </div>
    );
};

const getActiveKeys = (value: boolean | undefined, onlyKey: string, withoutKey: string): string[] => {
    if (value === true) {
        return [onlyKey];
    }

    if (value === false) {
        return [withoutKey];
    }

    return [];
};

const getFilterValue = (keys: Set<string | number>, onlyKey: string, withoutKey: string): boolean | undefined => {
    if (keys.has(onlyKey)) {
        return true;
    }

    if (keys.has(withoutKey)) {
        return false;
    }

    return undefined;
};

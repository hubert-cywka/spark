import { useState } from "react";

import useDebounce from "@/hooks/useDebounce.ts";
import { DateRangePreset } from "@/types/DateRangePreset.ts";
import { ISODateString } from "@/types/ISODateString";
import { getDateRange } from "@/utils/getDateRange.ts";

const DEBOUNCE_IN_MS = 300;

// TODO: Clean up
export const useEntriesDataGridFilters = () => {
    const [dateRange, setDateRange] = useState<{
        from: ISODateString;
        to: ISODateString;
    }>(getDateRange(DateRangePreset.PAST_MONTH));

    const [flags, setFlags] = useState<{
        completed?: boolean;
        featured?: boolean;
    }>({});

    const [content, setContent] = useState("");
    const [debouncedContent, setDebouncedContent] = useState(content);
    useDebounce(() => setDebouncedContent(content), DEBOUNCE_IN_MS, [content]);

    return {
        content,
        debouncedContent,
        setContent,
        dateRange,
        setDateRange,
        flags,
        setFlags,
    };
};

"use client";

import { Day } from "@/features/daily/components/Day/Day";
import { useDailies } from "@/features/daily/hooks/get/useDailies";

export const DailyList = () => {
    const { data } = useDailies({ from: "2025-01-01", to: "2025-02-02" });
    const dailies = data?.pages?.flatMap((page) => page.data) ?? [];

    return (
        <div>
            {dailies.map((daily) => (
                <Day daily={daily} key={daily.id} />
            ))}
        </div>
    );
};

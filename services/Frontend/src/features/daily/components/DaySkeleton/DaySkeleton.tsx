import { DayHeaderSkeleton } from "@/features/daily/components/DayHeader/DayHeaderSkeleton";
import { EntriesListSkeleton } from "@/features/entries/components/EntriesListSkeleton";

type DaySkeletonProps = {
    count?: number;
};

export const DaySkeleton = ({ count = 1 }: DaySkeletonProps) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index}>
                    <DayHeaderSkeleton />
                    <EntriesListSkeleton />
                </div>
            ))}
        </>
    );
};

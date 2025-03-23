import Skeleton from "react-loading-skeleton";

type StatsCardSkeletonProps = {
    className?: string;
    height: number;
};

export const StatsCardSkeleton = ({ className, height }: StatsCardSkeletonProps) => {
    return (
        <div className={className}>
            <Skeleton height={height} />
        </div>
    );
};

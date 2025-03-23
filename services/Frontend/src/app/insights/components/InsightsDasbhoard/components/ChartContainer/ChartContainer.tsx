import { PropsWithChildren } from "react";
import Skeleton from "react-loading-skeleton";

import { Card } from "@/components/Card";

type ChartContainerProps = PropsWithChildren<{
    className?: string;
    isLoading?: boolean;
    height: number;
}>;

export const ChartContainer = ({ className, children, isLoading, height }: ChartContainerProps) => {
    return <Card className={className}>{isLoading ? <Skeleton height={height} /> : children}</Card>;
};

import { PropsWithChildren } from "react";
import classNames from "clsx";

import commonStyles from "@/components/Chart/styles/Chart.module.scss";

type ChartContainerProps = PropsWithChildren<{
    height: number;
    title?: string;
}>;

export const ChartContainer = ({ children, height, title }: ChartContainerProps) => {
    return (
        <div className={classNames(commonStyles.container)} style={{ height }}>
            {title && <h2 className={commonStyles.title}>{title}</h2>}
            {children}
        </div>
    );
};

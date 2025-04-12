"use client";

import { PropsWithChildren } from "react";
import classNames from "clsx";
import { HelpCircleIcon } from "lucide-react";

import commonStyles from "@/components/Chart/styles/Chart.module.scss";

import { Icon } from "@/components/Icon";
import { Tooltip, TooltipChildrenWrapper } from "@/components/Tooltip";

type ChartContainerProps = PropsWithChildren<{
    height: number;
    title: string;
    description?: string;
}>;

export const ChartContainer = ({ children, height, title, description }: ChartContainerProps) => {
    return (
        <div className={classNames(commonStyles.container)} style={{ height }}>
            <header className={commonStyles.header}>
                {title && <h2 className={commonStyles.title}>{title}</h2>}

                {description && (
                    <Tooltip label={description}>
                        <TooltipChildrenWrapper>
                            <span>
                                <Icon slot={HelpCircleIcon} />
                            </span>
                        </TooltipChildrenWrapper>
                    </Tooltip>
                )}
            </header>

            {children}
        </div>
    );
};

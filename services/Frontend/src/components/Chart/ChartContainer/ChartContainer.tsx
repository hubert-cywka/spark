"use client";

import { PropsWithChildren } from "react";
import classNames from "clsx";
import { HelpCircleIcon } from "lucide-react";

import commonStyles from "@/components/Chart/styles/Chart.module.scss";

import { IconButton } from "@/components/IconButton";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type ChartContainerProps = PropsWithChildren<{
    height: number;
    title: string;
    description?: string;
}>;

export const ChartContainer = ({ children, height, title, description }: ChartContainerProps) => {
    const t = useTranslate();

    return (
        <div className={classNames(commonStyles.container)} style={{ height }}>
            <header className={commonStyles.header}>
                {title && <h2 className={commonStyles.title}>{title}</h2>}

                {description && (
                    <IconButton
                        variant="subtle"
                        iconSlot={HelpCircleIcon}
                        tooltip={description}
                        tooltipDelay={0}
                        aria-label={t("insights.charts.common.details.tooltipTriggerLabel", { title })}
                    />
                )}
            </header>

            {children}
        </div>
    );
};

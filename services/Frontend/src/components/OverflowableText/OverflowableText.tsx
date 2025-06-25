"use client";

import { PropsWithChildren } from "react";
import { Focusable } from "react-aria-components";
import classNames from "clsx";

import styles from "./styles/OverflowableText.module.scss";

import { Tooltip } from "@/components/Tooltip";
import { useIsOverflow } from "@/hooks/useIsOverflow.ts";

type OverflowableTextProps = PropsWithChildren<{
    tooltip?: string;
    className?: string;
}>;

export const OverflowableText = ({ children, className, tooltip }: OverflowableTextProps) => {
    const { isOverflow, ref } = useIsOverflow();

    return (
        <Tooltip label={tooltip} isDisabled={!isOverflow || !tooltip}>
            <Focusable>
                <span className={classNames(styles.container, className)} ref={ref}>
                    {children}
                </span>
            </Focusable>
        </Tooltip>
    );
};

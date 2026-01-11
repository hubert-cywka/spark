"use client";

import { forwardRef } from "react";
import clsx from "clsx";

import styles from "./styles/IconButton.module.scss";

import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { IconButtonProps } from "@/components/IconButton/types/IconButton";
import { Tooltip } from "@/components/Tooltip";

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({ tooltip, iconSlot, tooltipDelay, ...props }, ref) => {
    return (
        <Tooltip label={tooltip} delay={tooltipDelay}>
            <Button {...props} ref={ref} className={clsx(styles.iconButton, props.className)}>
                <Icon slot={iconSlot} size={props.size} />
            </Button>
        </Tooltip>
    );
});

IconButton.displayName = "IconButton";

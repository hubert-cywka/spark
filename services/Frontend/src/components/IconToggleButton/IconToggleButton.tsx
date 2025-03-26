import clsx from "clsx";

import styles from "@/components/IconButton/styles/IconButton.module.scss";

import { Icon } from "@/components/Icon";
import { IconToggleButtonProps } from "@/components/IconToggleButton/types/IconToggleButton";
import { ToggleButton } from "@/components/ToggleButton";
import { Tooltip } from "@/components/Tooltip";

export const IconToggleButton = ({ iconSlot, tooltip, ...props }: IconToggleButtonProps) => (
    <Tooltip label={tooltip}>
        <ToggleButton {...props} className={clsx(styles.iconButton, props.className)}>
            <Icon slot={iconSlot} size={props.size} />
        </ToggleButton>
    </Tooltip>
);

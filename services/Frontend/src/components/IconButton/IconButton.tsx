import clsx from "clsx";

import styles from "./styles/IconButton.module.scss";

import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { IconButtonProps } from "@/components/IconButton/types/IconButton";
import { Tooltip } from "@/components/Tooltip";

// TODO: Add aria-label to all icon buttons
export const IconButton = ({ tooltip, iconSlot, ...props }: IconButtonProps) => {
    return (
        <Tooltip label={tooltip}>
            <Button {...props} className={clsx(styles.iconButton, props.className)}>
                <Icon slot={iconSlot} size={props.size} />
            </Button>
        </Tooltip>
    );
};

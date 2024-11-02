import clsx from "clsx";

import styles from "./styles/IconButton.module.scss";

import { Button } from "@/components/Button";
import { IconButtonProps } from "@/components/IconButton/types/IconButton";
import { Tooltip } from "@/components/Tooltip";

export const IconButton = ({ tooltip, ...props }: IconButtonProps) => {
    return (
        <Tooltip label={tooltip}>
            <Button {...props} className={clsx(styles.iconButton, props.className)} />
        </Tooltip>
    );
};

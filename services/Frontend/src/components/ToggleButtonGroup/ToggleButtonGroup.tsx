import { ToggleButtonGroup as BaseToggleButtonGroup } from "react-aria-components";
import classNames from "clsx";

import styles from "./styles/ToggleButtonGroup.module.scss";

import { ToggleButtonGroupProps } from "@/components/ToggleButtonGroup/types/ToggleButtonGroup";

export const ToggleButtonGroup = ({ children, className, ...props }: ToggleButtonGroupProps) => {
    return (
        <BaseToggleButtonGroup {...props} className={classNames(styles.group, className)}>
            {children}
        </BaseToggleButtonGroup>
    );
};

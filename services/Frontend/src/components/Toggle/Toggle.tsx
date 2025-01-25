import { Switch, SwitchProps } from "react-aria-components";
import classNames from "clsx";

import styles from "./styles/Toggle.module.scss";

import { ToggleSize } from "@/components/Toggle/types/Toggle";

type ToggleProps = SwitchProps & { size?: ToggleSize };

export const Toggle = ({ className, isSelected, size = "2", ...props }: ToggleProps) => {
    return (
        <Switch {...props} className={classNames(className, styles.switch)} isSelected={isSelected} data-size={size}>
            <div
                className={classNames(styles.toggleContainer, {
                    [styles.selected]: isSelected,
                })}
            >
                <span
                    className={classNames(styles.toggle, {
                        [styles.selected]: isSelected,
                    })}
                />
            </div>
        </Switch>
    );
};

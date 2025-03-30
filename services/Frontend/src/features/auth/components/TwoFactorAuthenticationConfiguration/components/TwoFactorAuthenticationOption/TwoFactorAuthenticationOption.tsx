import styles from "./styles/TwoFactorAuthenticationOption.module.scss";

import { Toggle } from "@/components/Toggle";
import { TwoFactorAuthenticationStrategy } from "@/features/auth/types/TwoFactorAuthentication";

type TwoFactorAuthenticationOptionProps = {
    strategy: TwoFactorAuthenticationStrategy;
    label: string;
    isEnabled: boolean;
    onChange: (strategy: TwoFactorAuthenticationStrategy, newValue: boolean) => void;
};

export const TwoFactorAuthenticationOption = ({ label, strategy, isEnabled, onChange }: TwoFactorAuthenticationOptionProps) => {
    return (
        <li className={styles.option}>
            <Toggle isSelected={isEnabled} onChange={(value) => onChange(strategy, value)} /> {label}
        </li>
    );
};

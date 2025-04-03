import styles from "./styles/TwoFactorAuthenticationOption.module.scss";

import { Toggle } from "@/components/Toggle";
import { TwoFactorAuthenticationMethod } from "@/features/auth/types/TwoFactorAuthentication";

type TwoFactorAuthenticationIntegrationItemProps = {
    method: TwoFactorAuthenticationMethod;
    label: string;
    isEnabled: boolean;
    onChange: (strategy: TwoFactorAuthenticationMethod, newValue: boolean) => void;
};

export const TwoFactorAuthenticationIntegrationItem = ({
    label,
    method,
    isEnabled,
    onChange,
}: TwoFactorAuthenticationIntegrationItemProps) => {
    return (
        <li className={styles.option}>
            <Toggle isSelected={isEnabled} onChange={(value) => onChange(method, value)} /> {label}
        </li>
    );
};

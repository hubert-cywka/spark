import { MailIcon, QrCodeIcon } from "lucide-react";

import styles from "./styles/TwoFactorAuthenticationMethodSelection.module.scss";

import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { TwoFactorAuthenticationMethod } from "@/features/auth/types/TwoFactorAuthentication";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const TwoFactorAuthenticationMethodSelection = ({
    availableMethods,
    onMethodSelected,
}: {
    availableMethods: TwoFactorAuthenticationMethod[];
    onMethodSelected: (method: TwoFactorAuthenticationMethod) => void;
}) => {
    const t = useTranslate();

    return (
        <div className={styles.container}>
            {t("authentication.2fa.prompt.modal.methods.selection.description")}

            <div className={styles.list}>
                <Button
                    onPress={() => onMethodSelected("email")}
                    leftDecorator={<Icon slot={MailIcon} />}
                    isDisabled={!availableMethods.includes("email")}
                >
                    {t("authentication.2fa.prompt.modal.methods.email.label")}
                </Button>
                <Button
                    onPress={() => onMethodSelected("app")}
                    leftDecorator={<Icon slot={QrCodeIcon} />}
                    isDisabled={!availableMethods.includes("app")}
                >
                    {t("authentication.2fa.prompt.modal.methods.app.label")}
                </Button>
            </div>
        </div>
    );
};

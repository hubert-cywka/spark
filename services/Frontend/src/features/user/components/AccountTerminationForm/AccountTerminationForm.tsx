"use client";

import { useState } from "react";

import styles from "./styles/AccountTerminationForm.module.scss";

import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { useAccessValidation, useActivateAccessScopes } from "@/features/auth/hooks";
import { useTerminateAccount } from "@/features/user/hooks/useTerminateAccount.ts";
import { useTerminateAccountEvents } from "@/features/user/hooks/useTerminateAccountEvents.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const AccountTerminationForm = () => {
    const t = useTranslate();
    const [isAcknowledged, setIsAcknowledged] = useState(false);

    const { mutateAsync, isPending } = useTerminateAccount();
    const { onTerminateAccountSuccess, onTerminateAccountError } = useTerminateAccountEvents();

    const { activate } = useActivateAccessScopes();
    const { validate } = useAccessValidation();
    const { inactiveScopes } = validate(["delete:account"]);

    const handleAccountTermination = async () => {
        if (inactiveScopes.length) {
            activate(...inactiveScopes);
            return;
        }

        try {
            await mutateAsync();
            onTerminateAccountSuccess();
        } catch (error) {
            onTerminateAccountError(error);
        }
    };

    return (
        <div className={styles.container}>
            <Checkbox onChange={setIsAcknowledged} isSelected={isAcknowledged}>
                {t("user.account.termination.checkbox.label")}
            </Checkbox>
            <Button
                onPress={handleAccountTermination}
                isDisabled={!isAcknowledged}
                isLoading={isPending}
                className={styles.button}
                variant="danger"
            >
                {t("user.account.termination.button.label")}
            </Button>
        </div>
    );
};

"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import styles from "./styles/TwoFactorAuthenticationModal.module.scss";

import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { CodeInput } from "@/components/Input/CodeInput.tsx";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/Modal";
import { TwoFactorAuthenticationMethodSelection } from "@/features/auth/components/TwoFactorAuthenticationModal/components/TwoFactorAuthenticationMethodSelection";
import {
    AppTwoFactorAuthenticationPrompt,
    EmailTwoFactorAuthenticationPrompt,
} from "@/features/auth/components/TwoFactorAuthenticationModal/components/TwoFactorAuthenticationPrompt";
import { TWO_FACTOR_AUTH_CODE_LENGTH } from "@/features/auth/constants";
import { useTwoFactorAuthentication } from "@/features/auth/hooks";
import { useGetEnabled2FAOptions } from "@/features/auth/hooks/2fa/useGetEnabled2FAOptions.ts";
import { useUpgradeSession } from "@/features/auth/hooks/session/useUpgradeSession.ts";
import { useUpgradeSessionEvents } from "@/features/auth/hooks/session/useUpgradeSessionEvents.ts";
import { AccessScope } from "@/features/auth/types/Identity";
import { TwoFactorAuthenticationMethod } from "@/features/auth/types/TwoFactorAuthentication";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

const promptComponentsMap = {
    app: AppTwoFactorAuthenticationPrompt,
    email: EmailTwoFactorAuthenticationPrompt,
} as const;

type TwoFactorAuthenticationModalProps = {
    scopesToActivate: AccessScope[];
    onClose: () => void;
    method: TwoFactorAuthenticationMethod | null;
    onMethodSelected: (method: TwoFactorAuthenticationMethod | null) => void;
};

export const TwoFactorAuthenticationModal = ({ scopesToActivate, method, onMethodSelected }: TwoFactorAuthenticationModalProps) => {
    const t = useTranslate();
    const [code, setCode] = useState<string>("");

    const { data: options } = useGetEnabled2FAOptions();
    const availableMethods = (options ?? []).map(({ method }) => method);

    const { cancelAuthenticationProcess, isAuthenticationInProgress } = useTwoFactorAuthentication();
    const { mutateAsync: upgradeSession, isPending: isUpgradingSession } = useUpgradeSession();
    const { onSessionUpgradeSuccess, onSessionUpgradeError } = useUpgradeSessionEvents();

    const clearSelectedMethod = () => {
        onMethodSelected(null);
        clearCode();
    };

    const clearCode = () => {
        setCode("");
    };

    const handleSessionUpgrade = async () => {
        if (!method || code.length !== TWO_FACTOR_AUTH_CODE_LENGTH) {
            return;
        }

        try {
            await upgradeSession({ code, method, scopes: scopesToActivate });
            onSessionUpgradeSuccess();
            clearCode();
            cancelAuthenticationProcess();
        } catch (error) {
            onSessionUpgradeError(error);
        }
    };

    const TwoFactorAuthenticationPromptComponent = method ? promptComponentsMap[method] : null;

    return (
        <Modal isOpen={isAuthenticationInProgress}>
            <ModalHeader onClose={cancelAuthenticationProcess}>{t("authentication.2fa.prompt.modal.header")}</ModalHeader>

            <ModalBody>
                {!TwoFactorAuthenticationPromptComponent ? (
                    <TwoFactorAuthenticationMethodSelection onMethodSelected={onMethodSelected} availableMethods={availableMethods} />
                ) : (
                    <TwoFactorAuthenticationPromptComponent>
                        <CodeInput
                            value={code}
                            onChange={setCode}
                            onSubmit={handleSessionUpgrade}
                            length={TWO_FACTOR_AUTH_CODE_LENGTH}
                            label={t("authentication.2fa.prompt.modal.codeInput.label")}
                            className={styles.codeInput}
                        />
                    </TwoFactorAuthenticationPromptComponent>
                )}
            </ModalBody>

            <ModalFooter>
                {!!method && (
                    <Button
                        size="1"
                        className={styles.backButton}
                        leftDecorator={<Icon slot={ArrowLeft} size="1" />}
                        onPress={clearSelectedMethod}
                        variant="subtle"
                    >
                        {t("authentication.2fa.prompt.modal.backButton.label")}
                    </Button>
                )}

                <Button variant="secondary" onPress={cancelAuthenticationProcess}>
                    {t("authentication.2fa.prompt.modal.cancelButton.label")}
                </Button>

                <Button
                    variant="confirm"
                    isDisabled={code.length !== TWO_FACTOR_AUTH_CODE_LENGTH || isUpgradingSession}
                    onPress={handleSessionUpgrade}
                >
                    {t("authentication.2fa.prompt.modal.submitButton.label")}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

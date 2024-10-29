import { Suspense } from "react";

import styles from "@/app/authentication/(shared)/styles/Authentication.module.scss";

import { Card } from "@/components/card/Card";
import { AccountActivationHandler } from "@/features/auth/components/accountActivationHandler/AccountActivationHandler";
import { RequestActivationLinkForm } from "@/features/auth/components/requestActivationLinkForm/RequestAccountActivationLinkForm";
import { useRequestAccountActivationToken } from "@/features/auth/hooks/useRequestAccountActivationToken";
import { RequestActivationTokenRequestPayload } from "@/features/auth/types/authentication";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function Page() {
    const t = useTranslate();
    const { mutateAsync, isPending, isSuccess } = useRequestAccountActivationToken();

    const onSubmit = async (payload: RequestActivationTokenRequestPayload) => {
        try {
            await mutateAsync(payload);
            showToast().success({
                message: t("authentication.accountActivation.notifications.success.body"),
                title: t("authentication.accountActivation.notifications.success.title"),
            });
        } catch (err) {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err),
                title: t("authentication.accountActivation.notifications.error.title"),
            });
        }
    };

    return (
        <div className={styles.container}>
            <Suspense>
                <AccountActivationHandler />
            </Suspense>
            <Card>
                <h1 className={styles.header}>{t("authentication.accountActivation.form.header")}</h1>
                <p className={styles.caption}>{t("authentication.accountActivation.form.caption")}</p>
                <p className={styles.caption}>{t("authentication.accountActivation.form.warning")}</p>
                <RequestActivationLinkForm isDisabled={isSuccess} onSubmit={onSubmit} isLoading={isPending} />
            </Card>
        </div>
    );
}

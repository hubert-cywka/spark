import { AuthenticationPageStyled } from "@/app/routes/authentication/shared/styles/AuthenticationPage.styled";
import { Card } from "@/components/card/Card";
import { Page } from "@/components/page/Page";
import { AccountActivationHandler } from "@/features/auth/components/accountActivationHandler/AccountActivationHandler";
import { RequestActivationLinkForm } from "@/features/auth/components/requestActivationLinkForm/RequestAccountActivationLinkForm";
import { useRequestAccountActivationToken } from "@/features/auth/hooks/useRequestAccountActivationToken";
import { RequestActivationTokenRequestPayload } from "@/features/auth/types/authentication";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const ActivateAccountPage = () => {
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
        <Page>
            <AuthenticationPageStyled.ContentWrapper>
                <AccountActivationHandler />
                <Card>
                    <RequestActivationLinkForm isDisabled={isSuccess} onSubmit={onSubmit} isLoading={isPending} />
                </Card>
            </AuthenticationPageStyled.ContentWrapper>
        </Page>
    );
};

import { AuthenticationPageStyled } from "@/app/routes/authentication/shared/styles/AuthenticationPage.styled";
import { Card } from "@/components/card/Card";
import { Page } from "@/components/page/Page";
import { AccountActivationHandler } from "@/features/auth/components/accountActivationHandler/AccountActivationHandler";
import { RequestActivationLinkForm } from "@/features/auth/components/requestActivationLinkForm/RequestAccountActivationLinkForm";
import { useRequestAccountActivationToken } from "@/features/auth/hooks/useRequestAccountActivationToken";
import { RequestActivationTokenRequestPayload } from "@/features/auth/types/authentication";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const ActivateAccountPage = () => {
    const { mutateAsync, isPending, isSuccess } = useRequestAccountActivationToken();

    const onSubmit = async (payload: RequestActivationTokenRequestPayload) => {
        try {
            await mutateAsync(payload);
            showToast().success({
                message: "Please check your mail inbox to activate your account.",
                title: "Request sent",
            });
        } catch (err) {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err),
                title: "Request not sent",
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

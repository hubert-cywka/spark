import { AuthenticationPageStyled } from "@/app/routes/authentication/shared/styles/AuthenticationPage.styled";
import { Alert } from "@/components/alert/Alert";
import { Card } from "@/components/card/Card";
import { Page } from "@/components/page/Page";
import { AccountActivationHandler } from "@/features/auth/components/accountActivationHandler/AccountActivationHandler";
import { RequestActivationLinkForm } from "@/features/auth/components/requestActivationLinkForm/RequestAccountActivationLinkForm";
import { useAccountActivation } from "@/features/auth/hooks/useAccountActivation";
import { RequestActivationTokenRequestPayload } from "@/features/auth/types/authentication";
import { logger } from "@/lib/logger/logger";

export const ActivateAccountPage = () => {
    const { mutateAsync, isPending, error, isSuccess } = useAccountActivation().requestActivationToken;

    const onSubmit = async (payload: RequestActivationTokenRequestPayload) => {
        try {
            await mutateAsync(payload);
        } catch (err) {
            logger.error(err);
        }
    };

    return (
        <Page>
            <AuthenticationPageStyled.ContentWrapper>
                <AccountActivationHandler />
                <Card>
                    <RequestActivationLinkForm onSubmit={onSubmit} isLoading={isPending} />
                </Card>

                {isSuccess && <Alert variant="success">Verification link sent. Check your mail inbox.</Alert>}
                {!!error && <Alert variant="danger">{error.message}</Alert>}
            </AuthenticationPageStyled.ContentWrapper>
        </Page>
    );
};

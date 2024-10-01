import { useCallback } from "react";

import { Card } from "@/components/card/Card";
import { Page } from "@/components/page/Page";
import { LoginFormInputs } from "@/features/auth/components/loginForm/hooks/useLoginForm";
import { LoginForm } from "@/features/auth/components/loginForm/LoginForm";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { logger } from "@/lib/logger/logger";

export const Login = () => {
    const { mutateAsync: login, isPending } = useLogin(); // TODO: Loading state

    const handleLogin = useCallback(
        async (data: LoginFormInputs) => {
            try {
                await login(data);
            } catch (error) {
                // TODO: Error handling
                logger.error(error);
            }
        },
        [login]
    );

    return (
        <Page>
            <Card>
                <LoginForm onSubmit={handleLogin} isLoading={isPending} />
            </Card>
        </Page>
    );
};

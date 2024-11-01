"use client";

import Image from "next/image";

import GoogleLogo from "./assets/google-logo.svg";

import { Button } from "@/components/Button/Button";
import { useLoginWithGoogle } from "@/features/openIDConnect/google/hooks/useLoginWithGoogle";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export const GoogleOIDCButton = () => {
    const t = useTranslate();
    const { mutateAsync, isPending, isSuccess } = useLoginWithGoogle();

    const loginWithGoogle = () => {
        void mutateAsync();
    };

    return (
        <Button
            onPress={loginWithGoogle}
            isLoading={isPending}
            isDisabled={isSuccess}
            variant="secondary"
            size="3"
            leftDecorator={<Image src={GoogleLogo} alt="Google logo" width={16} height={16} />}
        >
            {t("authentication.oidc.google.button.label")}
        </Button>
    );
};

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import GoogleLogo from "./assets/google-logo.svg";
import { useLoginWithGoogle } from "../../hooks/useLoginWithGoogle";

import { Button } from "@/components/Button/Button";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export const GoogleOIDCButton = () => {
    const t = useTranslate();
    const { mutateAsync: getAuthURL, isPending, isSuccess } = useLoginWithGoogle();
    const router = useRouter();

    const loginWithGoogle = async () => {
        const { url } = await getAuthURL();
        router.push(url);
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
            {t("authentication.oidc.login.google.button.label")}
        </Button>
    );
};

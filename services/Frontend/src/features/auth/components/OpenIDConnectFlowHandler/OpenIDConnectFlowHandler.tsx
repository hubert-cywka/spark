"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import styles from "./styles/OpenIDConnectFlowHandler.module.scss";

import { AppRoute } from "@/app/appRoute";
import { Overlay } from "@/components/Overlay";
import { Spinner } from "@/components/Spinner";
import { useAuthSession, useGetAuthSessionFromQueryParams, useLoginEvents } from "@/features/auth/hooks";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export const OpenIDConnectFlowHandler = () => {
    const t = useTranslate();
    const router = useRouter();

    const { onLoginSuccess } = useLoginEvents();
    const storeSession = useAuthSession((state) => state.storeSession);
    const session = useGetAuthSessionFromQueryParams();

    useEffect(() => {
        if (session) {
            storeSession(session);
            onLoginSuccess();
        } else {
            // TODO: Do we need to add something else here?
            router.push(AppRoute.LOGIN);
        }
    }, [onLoginSuccess, router, session, storeSession]);

    return (
        <Overlay>
            {session && (
                <>
                    <h2 className={styles.title}>{t("authentication.oidc.login.redirect.title")}</h2>
                    <p className={styles.info}>{t("authentication.oidc.login.redirect.info")}</p>
                </>
            )}
            <Spinner />
        </Overlay>
    );
};

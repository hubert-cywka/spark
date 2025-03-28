"use client";

import { useEffect } from "react";

import styles from "./styles/OpenIDConnectFlowHandler.module.scss";

import { Overlay } from "@/components/Overlay";
import { Spinner } from "@/components/Spinner";
import { useHandleOIDCError } from "@/features/auth/components/OpenIDConnectFlowHandler/hooks/useHandleOIDCError.ts";
import { useAuthSession, useGetAuthSessionFromQueryParams, useLoginEvents } from "@/features/auth/hooks";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export const OpenIDConnectFlowHandler = () => {
    const t = useTranslate();

    const { onLoginSuccess } = useLoginEvents();
    const storeSession = useAuthSession((state) => state.storeSession);
    const session = useGetAuthSessionFromQueryParams();
    const { hasOIDCFailed, onOIDCError } = useHandleOIDCError();

    useEffect(() => {
        if (session) {
            storeSession(session);
            onLoginSuccess();
        } else if (hasOIDCFailed) {
            onOIDCError();
        }
    }, [hasOIDCFailed, onLoginSuccess, onOIDCError, session, storeSession]);

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

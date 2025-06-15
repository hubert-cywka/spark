import styles from "@/app/(open)/authentication/shared/styles/Authentication.module.scss";
import "server-only";

import { AUTHENTICATION_SPOTLIGHT_OPACITY } from "@/app/(open)/authentication/constants.ts";
import { AppRoute } from "@/app/appRoute";
import { Anchor } from "@/components/Anchor";
import SpotlightCard from "@/components/SpotlightCard/SpotlightCard.tsx";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { UpdatePasswordForm } from "@/features/auth/components/UpdatePasswordForm";
import { onlyAsUnauthenticated } from "@/features/auth/hoc/withAuthorization";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore";
import { getTranslationsAsync } from "@/lib/i18n/hooks/useTranslate";
import { PageSearchParams } from "@/types/Page";

type ResetPasswordPageProps = { searchParams: PageSearchParams };

async function Page({ searchParams }: ResetPasswordPageProps) {
    const { token } = await searchParams;
    const t = await getTranslationsAsync();

    return (
        <main className={styles.container}>
            <SpotlightCard as="section" spotlightOpacity={AUTHENTICATION_SPOTLIGHT_OPACITY}>
                {typeof token === "string" ? (
                    <>
                        <h1 className={styles.header}>{t("authentication.passwordReset.form.header")}</h1>
                        <p className={styles.caption}>{t("authentication.passwordReset.form.caption")}</p>
                        <p className={styles.caption}>
                            {t("authentication.passwordReset.form.logInLink.link")}{" "}
                            <Anchor href={AppRoute.LOGIN}>{t("authentication.passwordReset.form.logInLink.link")}</Anchor>
                        </p>
                        <UpdatePasswordForm passwordChangeToken={token} />
                    </>
                ) : (
                    <>
                        <h1 className={styles.header}>{t("authentication.requestPasswordReset.form.header")}</h1>
                        <p className={styles.caption}>{t("authentication.requestPasswordReset.form.caption")}</p>
                        <p className={styles.caption}>
                            <Anchor href={AppRoute.LOGIN}>{t("authentication.requestPasswordReset.form.logInLink")}</Anchor>
                        </p>
                        <ResetPasswordForm />
                    </>
                )}
            </SpotlightCard>
        </main>
    );
}

export default withSessionRestore(onlyAsUnauthenticated(Page));

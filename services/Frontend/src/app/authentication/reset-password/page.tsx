import styles from "@/app/authentication/shared/styles/Authentication.module.scss";

import { AppRoute } from "@/app/appRoute";
import { Anchor } from "@/components/Anchor";
import { Card } from "@/components/Card";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { UpdatePasswordForm } from "@/features/auth/components/UpdatePasswordForm";
import { getTranslationsAsync } from "@/lib/i18n/hooks/useTranslate";
import { PageSearchParams } from "@/types/Page";

type ResetPasswordPageProps = { searchParams: PageSearchParams };

export default async function Page({ searchParams }: ResetPasswordPageProps) {
    const { token } = await searchParams;
    const t = await getTranslationsAsync();

    return (
        <div className={styles.container}>
            <Card>
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
            </Card>
        </div>
    );
}

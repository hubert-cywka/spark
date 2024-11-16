import styles from "@/app/authentication/shared/styles/Authentication.module.scss";
import "server-only";

import { Card } from "@/components/Card";
import { CreateAccountWithOIDCForm } from "@/features/auth/components/CreateAccountWithOIDCForm";
import { onlyAsUnauthenticated } from "@/features/auth/hoc/withAuthorization";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

function Page() {
    const t = useTranslate();

    return (
        <div className={styles.container}>
            <Card>
                <h1 className={styles.header}>{t("authentication.oidc.register.form.header")}</h1>
                <p className={styles.caption}>{t("authentication.oidc.register.form.description")}</p>
                <CreateAccountWithOIDCForm />
            </Card>
        </div>
    );
}

export default onlyAsUnauthenticated(Page);

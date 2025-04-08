import { Suspense } from "react";

import styles from "@/app/authentication/shared/styles/Authentication.module.scss";
import "server-only";

import { OpenIDConnectFlowHandler } from "@/features/auth/components/OpenIDConnectFlowHandler";
import { onlyAsUnauthenticated } from "@/features/auth/hoc/withAuthorization";

function Page() {
    return (
        <main className={styles.container}>
            <Suspense>
                <OpenIDConnectFlowHandler />
            </Suspense>
        </main>
    );
}

export default onlyAsUnauthenticated(Page);

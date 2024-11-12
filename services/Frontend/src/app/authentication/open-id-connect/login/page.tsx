import { Suspense } from "react";

import styles from "@/app/authentication/shared/styles/Authentication.module.scss";
import "server-only";

import { OpenIDConnectFlowHandler } from "@/features/auth/components/OpenIDConnectFlowHandler";

export default function Page() {
    return (
        <div className={styles.container}>
            <Suspense>
                <OpenIDConnectFlowHandler />
            </Suspense>
        </div>
    );
}

import styles from "./styles/FAQPage.module.scss";
import "server-only";

import { Container } from "@/components/Container";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore.tsx";

// TODO: Content
function Page() {
    return <Container className={styles.container}>WIP</Container>;
}

export default withSessionRestore(Page, { inBackground: true });

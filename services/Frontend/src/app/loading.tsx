import styles from "./styles/Loading.module.scss";
import "server-only";

import { Spinner } from "@/components/Spinner";

export default function Loading() {
    return (
        <div className={styles.container}>
            <Spinner size="3" />
        </div>
    );
}

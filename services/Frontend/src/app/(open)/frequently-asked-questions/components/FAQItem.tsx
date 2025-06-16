import { PropsWithChildren } from "react";
import styles from "../styles/FAQPage.module.scss";

type FAQItemProps = PropsWithChildren<{
    question: string;
}>;

export function FAQItem({ question, children }: FAQItemProps) {
    return (
        <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>{question}</h3>
            <div className={styles.faqAnswer}>{children}</div>
        </div>
    );
}

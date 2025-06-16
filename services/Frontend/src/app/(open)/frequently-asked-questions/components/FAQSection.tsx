import { PropsWithChildren } from "react";
import styles from "../styles/FAQPage.module.scss";

type FAQSectionProps = PropsWithChildren<{
    title: string;
}>;

export function FAQSection({ title, children }: FAQSectionProps) {
    return (
        <section className={styles.faqSection}>
            <h2 className={styles.faqSectionTitle}>{title}</h2>
            {children}
        </section>
    );
}

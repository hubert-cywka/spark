import styles from "../styles/FAQPage.module.scss";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { FAQContentQuestion } from "../../types/FAQ";

type FAQItemProps = {
    question: FAQContentQuestion;
};

export function FAQItem({ question }: FAQItemProps) {
    const t = useTranslate();

    return (
        <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>{t(question.questionTranslationKey)}</h3>
            <div className={styles.faqAnswer}>
                <p>{t(question.answerTranslationKey)}</p>
            </div>
        </div>
    );
}

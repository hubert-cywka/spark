import styles from "../styles/FAQPage.module.scss";
import { FAQContentSection } from "../../types/FAQ";
import { FAQItem } from "./FAQItem";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type FAQSectionProps = {
    section: FAQContentSection;
    sectionIndex: number;
};

export function FAQSection({ section, sectionIndex }: FAQSectionProps) {
    const t = useTranslate();

    return (
        <section id={section.id} className={styles.faqSection}>
            <h2 className={styles.faqSectionTitle}>
                {sectionIndex + 1}. {t(section.titleTranslationKey)}
            </h2>
            {section.questions.map((question, qIndex) => (
                <FAQItem key={qIndex} question={question} />
            ))}
        </section>
    );
}

import styles from "./styles/FAQTableOfContents.module.scss";

import { FAQContentSection } from "@/app/(open)/frequently-asked-questions/types/FAQ";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type FAQTableOfContentsProps = {
    content: FAQContentSection[];
};

export const FAQTableOfContents = ({ content }: FAQTableOfContentsProps) => {
    const t = useTranslate();

    return (
        <nav className={styles.tableOfContents}>
            <h2 className={styles.header}>{t("faq.tableOfContents.title")}</h2>
            <ul className={styles.list}>
                {content.map((section, sectionIndex) => (
                    <li key={section.id} className={styles.listItem}>
                        <a href={`#${section.id}`} className={styles.link}>
                            {sectionIndex + 1}. {t(section.titleTranslationKey)}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

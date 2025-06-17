import styles from "./styles/DocumentationSubsection.module.scss";

import { DocumentationContentSubsection } from "@/features/documentation";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type DocumentationSubsectionProps = {
    subsection: DocumentationContentSubsection;
};

export const DocumentationSubsection = ({ subsection }: DocumentationSubsectionProps) => {
    const t = useTranslate();

    return (
        <div key={subsection.id}>
            <h3 id={subsection.id} className={styles.header}>
                {t(subsection.titleTranslationKey)}
            </h3>

            {subsection.paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex} className={styles.paragraph}>
                    {t(paragraph.translationKey)}
                </p>
            ))}
        </div>
    );
};

import styles from "./styles/DocumentationSection.module.scss";

import { DocumentationContentSection, DocumentationSubsection } from "@/features/documentation";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type DocumentationSectionProps = {
    section: DocumentationContentSection;
    sectionIndex: number;
};

export const DocumentationSection = ({ section, sectionIndex }: DocumentationSectionProps) => {
    const t = useTranslate();

    return (
        <section id={section.id} key={section.id}>
            <h2 className={styles.header}>
                {sectionIndex + 1}. {t(section.titleTranslationKey)}
            </h2>

            {section.paragraphs.map((paragraph, pIndex) => (
                <p className={styles.paragraph} key={pIndex}>
                    {t(paragraph.translationKey)}
                </p>
            ))}

            {!!section.subsections?.length && (
                <>
                    {section.subsections.map((subsection) => (
                        <DocumentationSubsection key={subsection.id} subsection={subsection} />
                    ))}
                </>
            )}
        </section>
    );
};

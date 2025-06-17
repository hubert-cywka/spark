import styles from "./styles/DocumentationTableOfContents.module.scss";

import { Anchor } from "@/components/Anchor";
import { DocumentationContentSection } from "@/features/documentation";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type DocumentationTableOfContentProps = {
    content: DocumentationContentSection[];
};

export const DocumentationTableOfContents = ({ content }: DocumentationTableOfContentProps) => {
    const t = useTranslate();

    return (
        <nav className={styles.tableOfContents}>
            <ol>
                {content.map((section) => (
                    <li key={section.id}>
                        <Anchor href={`#${section.id}`}>{t(section.titleTranslationKey)}</Anchor>

                        {section.subsections && section.subsections.length > 0 && (
                            <ol>
                                {section.subsections.map((subsection) => (
                                    <li key={subsection.id}>
                                        <Anchor href={`#${subsection.id}`}>{t(subsection.titleTranslationKey)}</Anchor>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

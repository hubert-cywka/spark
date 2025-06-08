import styles from "./styles/TermsAndConditionsTableOfContents.module.scss";

import { TermsAndConditionsContentSection } from "@/app/terms-and-conditions/types/TermsAndConditions";
import { Anchor } from "@/components/Anchor";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type TermsAndConditionsTableOfContentsProps = {
    content: TermsAndConditionsContentSection[];
};

export const TermsAndConditionsTableOfContents = ({ content }: TermsAndConditionsTableOfContentsProps) => {
    const t = useTranslate();

    return (
        <nav className={styles.tableOfContents}>
            <ol>
                {content.map((section) => (
                    <li key={section.id}>
                        <Anchor href={`#${section.id}`}>{t(section.titleKey)}</Anchor>

                        {section.subsections && section.subsections.length > 0 && (
                            <ol>
                                {section.subsections.map((subsection) => (
                                    <li key={subsection.id}>
                                        <Anchor href={`#${subsection.id}`}>{t(subsection.titleKey)}</Anchor>
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

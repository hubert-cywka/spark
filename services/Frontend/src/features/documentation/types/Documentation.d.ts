export type DocumentationParagraph = {
    translationKey: string;
};

export type DocumentationContentSubsection = {
    id: string;
    titleTranslationKey: string;
    paragraphs: DocumentationParagraph[];
};

export type DocumentationContentSection = {
    id: string;
    titleTranslationKey: string;
    paragraphs: DocumentationParagraph[];
    subsections?: DocumentationContentSubsection[];
};

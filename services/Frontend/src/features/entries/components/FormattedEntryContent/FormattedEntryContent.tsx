import { Focusable } from "react-aria-components";

import styles from "./styles/FormattedEntryContent.module.scss";

import { Anchor } from "@/components/Anchor";

type FormattedContentProps = {
    content: string;
};

export const FormattedEntryContent = ({ content }: FormattedContentProps) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);

    return (
        <Focusable>
            <span>
                {parts.map((part, index) => {
                    if (urlRegex.test(part)) {
                        const displayText = part.replace(/https?:\/\//, "");

                        return (
                            <Anchor href={part} target="_blank" rel="noopener noreferrer" className={styles.link} key={index}>
                                {displayText}
                            </Anchor>
                        );
                    }
                    return <span key={index}>{part}</span>;
                })}
            </span>
        </Focusable>
    );
};

import { Fragment, useMemo } from "react";
import { Focusable } from "react-aria-components";

import styles from "./styles/FormattedEntryContent.module.scss";

import { Anchor } from "@/components/Anchor";
import { beautifyUrl } from "@/utils/urlUtils.ts";

type FormattedContentProps = {
    content: string;
};

export const FormattedEntryContent = ({ content }: FormattedContentProps) => {
    const memoizedParts = useMemo(() => {
        const urlRegex = /(https?:\/\/\S+[a-zA-Z0-9/#])([.,!?)]*)/g;
        const parts = [];
        let lastIndex = 0;

        if (!content) {
            return [];
        }

        for (const match of content.matchAll(urlRegex)) {
            const href = match[1];
            const trailingText = match[2];
            const matchIndex = match.index ?? 0;

            if (matchIndex > lastIndex) {
                parts.push(content.substring(lastIndex, matchIndex));
            }

            const displayText = beautifyUrl(href);
            parts.push(
                <Fragment key={`match-${matchIndex}`}>
                    <Anchor href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        {displayText}
                    </Anchor>
                    {trailingText}
                </Fragment>
            );

            lastIndex = matchIndex + (match[0]?.length ?? 0);
        }

        parts.push(content.substring(lastIndex));

        return parts;
    }, [content]);

    return (
        <Focusable>
            <span>{memoizedParts}</span>
        </Focusable>
    );
};

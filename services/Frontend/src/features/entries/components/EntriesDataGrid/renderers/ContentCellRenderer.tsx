import { RenderCellProps } from "react-data-grid";

import styles from "./styles/ContentCellRenderer.module.scss";

import { Tooltip } from "@/components/Tooltip";
import { FormattedEntryContent } from "@/features/entries/components/FormattedEntryContent";
import { DetailedEntry } from "@/features/entries/types/Entry";

type ContentCellValueRendererProps = {
    value: string;
};

const ContentCellValueRenderer = ({ value }: ContentCellValueRendererProps) => {
    return (
        <Tooltip label={value}>
            <FormattedEntryContent content={value} />
        </Tooltip>
    );
};

export const ContentCellRenderer = ({ row }: RenderCellProps<DetailedEntry>) => {
    return (
        <div className={styles.container}>
            <ContentCellValueRenderer value={row.content} />
        </div>
    );
};

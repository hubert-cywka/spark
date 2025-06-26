import { RenderCellProps } from "react-data-grid";

import { EntryRow } from "../types/EntriesDataGrid";

import styles from "./styles/ContentCellRenderer.module.scss";

import { Tooltip } from "@/components/Tooltip";
import { FormattedEntryContent } from "@/features/entries/components/FormattedEntryContent";

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

export const ContentCellRenderer = ({ row }: RenderCellProps<EntryRow>) => {
    return (
        <div className={styles.container}>
            <ContentCellValueRenderer value={row.content} />
        </div>
    );
};

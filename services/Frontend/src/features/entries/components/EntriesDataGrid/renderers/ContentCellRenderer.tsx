import { Focusable } from "react-aria-components";
import { RenderCellProps } from "react-data-grid";

import { EntryRow } from "../types/EntriesDataGrid";

import styles from "./styles/ContentCellRenderer.module.scss";

import { Tooltip } from "@/components/Tooltip";
import { FormattedEntryContent } from "@/features/entries/components/FormattedEntryContent";

export const ContentCellRenderer = (p: RenderCellProps<EntryRow>) => {
    return (
        <div className={styles.container}>
            <Tooltip label={p.row.content}>
                <Focusable>
                    <span>
                        <FormattedEntryContent content={p.row.content} />
                    </span>
                </Focusable>
            </Tooltip>
        </div>
    );
};

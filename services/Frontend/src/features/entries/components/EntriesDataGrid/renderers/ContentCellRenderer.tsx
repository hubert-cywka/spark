import { RenderCellProps } from "react-data-grid";

import { EntryRow } from "../types/EntriesDataGrid";

import styles from "./styles/ContentCellRenderer.module.scss";

export const ContentCellRenderer = (p: RenderCellProps<EntryRow>) => {
    return <div className={styles.container}>{p.row.content}</div>;
};

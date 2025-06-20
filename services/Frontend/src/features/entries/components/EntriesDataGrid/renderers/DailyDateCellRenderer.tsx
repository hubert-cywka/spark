import { RenderCellProps } from "react-data-grid";

import { EntryRow } from "../types/EntriesDataGrid";

import styles from "./styles/DailyDateCellRenderer.module.scss";

export const DailyDateCellRenderer = (p: RenderCellProps<EntryRow>) => {
    return <div className={styles.container}>{p.row.daily}</div>;
};

import { RenderCellProps, RenderGroupCellProps } from "react-data-grid";

import { EntryRow } from "../types/EntriesDataGrid";

import styles from "./styles/DailyDateCellRenderer.module.scss";

import { GroupCellRenderer } from "@/components/DataGrid/renderers/GroupCellRenderer.tsx";

export const DailyDateCellRenderer = (p: RenderCellProps<EntryRow>) => {
    return <div className={styles.container}>{p.row.daily}</div>;
};

export const DailyDateGroupCellRenderer = (p: RenderGroupCellProps<EntryRow>) => {
    return <GroupCellRenderer {...p}>{p.row.childRows[0].daily}</GroupCellRenderer>;
};

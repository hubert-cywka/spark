import styles from "./styles/ExportEntriesList.module.scss";

import { ExportEntryItem } from "@/features/export/components/ExportEntryItem/ExportEntryItem.tsx";
import { DataExportEntry } from "@/features/export/types/DataExport";

type ExportEntriesListProps = {
    entries: DataExportEntry[];
};

export const ExportEntriesList = ({ entries }: ExportEntriesListProps) => {
    return <ul className={styles.list}>{entries?.map((entry) => <ExportEntryItem key={entry.id} entry={entry} />)}</ul>;
};

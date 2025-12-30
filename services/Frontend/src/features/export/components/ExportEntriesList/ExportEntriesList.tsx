import styles from "./styles/ExportEntriesList.module.scss";

import { ExportEntryItem } from "@/features/export/components/ExportEntryItem/ExportEntryItem.tsx";
import { DataExportEntry } from "@/features/export/types/DataExport";

type ExportEntriesListProps = {
    entries: DataExportEntry[];
    onCancel: (exportId: string) => Promise<void>;
};

export const ExportEntriesList = ({ entries, onCancel }: ExportEntriesListProps) => {
    return <ul className={styles.list}>{entries?.map((entry) => <ExportEntryItem key={entry.id} entry={entry} onCancel={onCancel} />)}</ul>;
};

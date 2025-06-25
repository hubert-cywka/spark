import { RenderCellProps, RenderGroupCellProps } from "react-data-grid";

import { EntryRow } from "../types/EntriesDataGrid";

import styles from "./styles/DailyDateCellRenderer.module.scss";

import { GroupCellRenderer } from "@/components/DataGrid/renderers/GroupCellRenderer.tsx";
import { OverflowableText } from "@/components/OverflowableText";
import { ISODateString } from "@/types/ISODateString";

type DailyDateCellValueRendererProps = {
    value: ISODateString;
};

const DailyDateCellValueRenderer = ({ value }: DailyDateCellValueRendererProps) => {
    return <OverflowableText tooltip={value}>{value}</OverflowableText>;
};

export const DailyDateCellRenderer = ({ row }: RenderCellProps<EntryRow>) => {
    return (
        <div className={styles.container}>
            <DailyDateCellValueRenderer value={row.daily} />
        </div>
    );
};

export const DailyDateGroupCellRenderer = (p: RenderGroupCellProps<EntryRow>) => {
    return (
        <GroupCellRenderer {...p}>
            <DailyDateCellValueRenderer value={p.row.childRows[0].daily} />
        </GroupCellRenderer>
    );
};

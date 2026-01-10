import { RenderCellProps, RenderGroupCellProps } from "react-data-grid";

import styles from "./styles/DateCellRenderer.module.scss";

import { GroupCellRenderer } from "@/components/DataGrid/renderers/GroupCellRenderer.tsx";
import { OverflowableText } from "@/components/OverflowableText";
import { DetailedEntry } from "@/features/entries/types/Entry";
import { ISODateString } from "@/types/ISODateString";

type DateCellValueRendererProps = {
    value: ISODateString;
};

const DateCellValueRenderer = ({ value }: DateCellValueRendererProps) => {
    return <OverflowableText tooltip={value}>{value}</OverflowableText>;
};

export const DateCellRenderer = ({ row }: RenderCellProps<DetailedEntry>) => {
    return (
        <div className={styles.container}>
            <DateCellValueRenderer value={row.date} />
        </div>
    );
};

export const DateGroupCellRenderer = (p: RenderGroupCellProps<DetailedEntry>) => {
    return (
        <GroupCellRenderer {...p}>
            <DateCellValueRenderer value={p.row.childRows[0].date} />
        </GroupCellRenderer>
    );
};

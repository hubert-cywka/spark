import { RenderCellProps, RenderGroupCellProps } from "react-data-grid";

import styles from "./styles/DailyDateCellRenderer.module.scss";

import { GroupCellRenderer } from "@/components/DataGrid/renderers/GroupCellRenderer.tsx";
import { OverflowableText } from "@/components/OverflowableText";
import { DetailedEntry } from "@/features/entries/types/Entry";
import { ISODateString } from "@/types/ISODateString";

type DailyDateCellValueRendererProps = {
    value: ISODateString;
};

const DailyDateCellValueRenderer = ({ value }: DailyDateCellValueRendererProps) => {
    return <OverflowableText tooltip={value}>{value}</OverflowableText>;
};

export const DailyDateCellRenderer = ({ row }: RenderCellProps<DetailedEntry>) => {
    return (
        <div className={styles.container}>
            <DailyDateCellValueRenderer value={row.daily} />
        </div>
    );
};

export const DailyDateGroupCellRenderer = (p: RenderGroupCellProps<DetailedEntry>) => {
    return (
        <GroupCellRenderer {...p}>
            <DailyDateCellValueRenderer value={p.row.childRows[0].daily} />
        </GroupCellRenderer>
    );
};

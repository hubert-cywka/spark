import { RenderCellProps, RenderGroupCellProps } from "react-data-grid";

import styles from "./styles/GoalsCellRenderer.module.scss";

import { GroupCellRenderer } from "@/components/DataGrid/renderers/GroupCellRenderer.tsx";
import { OverflowableText } from "@/components/OverflowableText";
import { DetailedEntry } from "@/features/entries/types/Entry";

// TODO: Better visualization
type GoalsCellValueRendererProps = {
    value: string[];
};

const GoalsCellValueRenderer = ({ value }: GoalsCellValueRendererProps) => {
    const tooltip = value.map((item) => `"${item}"`).join(", ");

    return <OverflowableText tooltip={tooltip}>{value.join(", ")}</OverflowableText>;
};

export const GoalsCellRenderer = ({ row }: RenderCellProps<DetailedEntry>) => {
    return (
        <div className={styles.container}>
            <GoalsCellValueRenderer value={row.goals} />
        </div>
    );
};

export const GoalsGroupCellRenderer = (p: RenderGroupCellProps<DetailedEntry>) => {
    return (
        <GroupCellRenderer {...p}>
            <GoalsCellValueRenderer value={[p.row.childRows[0].goals[0]]} />
        </GroupCellRenderer>
    );
};

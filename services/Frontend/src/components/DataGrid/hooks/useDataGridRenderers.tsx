import { JSX, useMemo } from "react";
import { RenderHeaderCellProps } from "react-data-grid";

import { HeaderCellRenderer } from "@/components/DataGrid/renderers/HeaderCellRenderer.tsx";

type UseDataGridRenderersOptions = {
    allGroups: string[];
    activeGroups: string[];
    onColumnGrouped: (key: string) => void;
    onColumnUngrouped: (key: string) => void;
};

type DataGridRenderers<TData> = {
    headerCellRenderer: (props: RenderHeaderCellProps<TData>) => JSX.Element;
};

export const useDataGridRenderers = <TData extends object>({
    allGroups,
    activeGroups,
    onColumnGrouped,
    onColumnUngrouped,
}: UseDataGridRenderersOptions): DataGridRenderers<TData> => {
    return useMemo(
        () => ({
            headerCellRenderer: (props: RenderHeaderCellProps<TData>) => (
                <HeaderCellRenderer
                    {...props}
                    group={() => onColumnGrouped(props.column.key)}
                    ungroup={() => onColumnUngrouped(props.column.key)}
                    groupIndex={findIndexOf(activeGroups, props.column.key)}
                    canBeGrouped={allGroups.includes(props.column.key)}
                />
            ),
        }),
        [activeGroups, allGroups, onColumnGrouped, onColumnUngrouped]
    );
};

const findIndexOf = <T,>(array: T[], item: T): number | undefined => {
    const index = array.indexOf(item);

    if (index >= 0) {
        return index;
    }
};

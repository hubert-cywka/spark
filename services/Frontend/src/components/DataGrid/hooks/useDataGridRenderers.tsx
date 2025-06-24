import { JSX, useMemo } from "react";
import { RenderHeaderCellProps } from "react-data-grid";

import { HeaderCellRenderer } from "@/components/DataGrid/renderers/HeaderCellRenderer.tsx";

type UseDataGridRenderersOptions = {
    activeGroups: string[];
    onColumnGrouped: (key: string) => void;
    onColumnUngrouped: (key: string) => void;
};

type DataGridRenderers<TData> = {
    headerCellRenderer: (props: RenderHeaderCellProps<TData>) => JSX.Element;
};

export const useDataGridRenderers = <TData extends object>({
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
                    isGrouped={activeGroups.includes(props.column.key)}
                    canBeGrouped={!!props.column.renderGroupCell}
                />
            ),
        }),
        [activeGroups, onColumnGrouped, onColumnUngrouped]
    );
};

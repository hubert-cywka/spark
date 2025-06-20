import { useMemo } from "react";

import { HeaderCellRenderer } from "@/components/DataGrid/renderers/HeaderCellRenderer.tsx";

export const useDataGridRenderers = () => {
    return useMemo(
        () => ({
            headerCellRenderer: HeaderCellRenderer,
        }),
        []
    );
};

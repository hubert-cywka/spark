import { RenderCellProps, RenderGroupCellProps } from "react-data-grid";
import { SquareCheckIcon, SquareIcon } from "lucide-react";

import { EntryRow } from "../types/EntriesDataGrid";

import { Badge } from "@/components/Badge";
import { GroupCellRenderer } from "@/components/DataGrid/renderers/GroupCellRenderer.tsx";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type IsFeaturedCellValueRendererProps = {
    value: boolean;
};

export const IsFeaturedCellValueRenderer = ({ value }: IsFeaturedCellValueRendererProps) => {
    const t = useTranslate();

    return value ? (
        <Badge label={t("entries.values.featured")} icon={SquareCheckIcon} variant="success" />
    ) : (
        <Badge label={t("entries.values.notFeatured")} icon={SquareIcon} />
    );
};

export const IsFeaturedCellRenderer = ({ row }: RenderCellProps<EntryRow>) => {
    return <IsFeaturedCellValueRenderer value={row.isFeatured} />;
};

export const IsFeaturedGroupCellRenderer = (p: RenderGroupCellProps<EntryRow>) => {
    return (
        <GroupCellRenderer {...p}>
            <IsFeaturedCellValueRenderer value={p.row.childRows[0].isFeatured} />
        </GroupCellRenderer>
    );
};
